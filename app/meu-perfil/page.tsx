'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  User, Mail, Phone, ArrowLeft, Lock,
  CheckCircle, Clock, Shield, Bell,
} from 'lucide-react';
import { useClientAuth } from '@/lib/contexts/ClientAuthContext';
import clientApi from '@/lib/client-api';

// ─────────────────────────────────────────────────────────────────────────────
// Tipos
// ─────────────────────────────────────────────────────────────────────────────
type PhoneStep = 'idle' | 'entering' | 'sent' | 'verified';

interface ClientData {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  nameChangedAt?: string;
  phoneVerified?: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
function calcNameBlockedDays(nameChangedAt?: string): number | null {
  if (!nameChangedAt) return null;
  const daysSince =
    (Date.now() - new Date(nameChangedAt).getTime()) / (1000 * 60 * 60 * 24);
  if (daysSince < 30) return Math.ceil(30 - daysSince);
  return null;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric'
  });
}

function calcNextChangeDate(nameChangedAt?: string): string | null {
  if (!nameChangedAt) return null;
  const changed = new Date(nameChangedAt);
  const next = new Date(changed.getTime() + 30 * 24 * 60 * 60 * 1000);
  return formatDate(next);
}

function calcChangedDate(nameChangedAt?: string): string | null {
  if (!nameChangedAt) return null;
  return formatDate(new Date(nameChangedAt));
}

function formatPhone(raw: string): string {
  const d = raw.replace(/\D/g, '');
  if (d.length === 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return raw;
}

// ─────────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────────
export default function PerfilPage() {
  const router = useRouter();
  const { client, isAuthenticated, loading: authLoading } = useClientAuth();

  // dados carregados da API
  const [userData, setUserData] = useState<ClientData | null>(null);
  const [pageLoading, setPageLoading] = useState(true);

  // ── Nome ─────────────────────────────────────────────────────────────────
  const [editingName, setEditingName] = useState(false);
  const [nameValue, setNameValue] = useState('');
  const [savingName, setSavingName] = useState(false);
  const [nameBlockedDays, setNameBlockedDays] = useState<number | null>(null);
  const [nameMsg, setNameMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  // ── Telefone OTP ─────────────────────────────────────────────────────────
  const [phoneStep, setPhoneStep] = useState<PhoneStep>('idle');
  const [phoneValue, setPhoneValue] = useState('');
  const [otpValue, setOtpValue] = useState('');
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [phoneMsg, setPhoneMsg] = useState<{ type: 'ok' | 'err' | 'info'; text: string } | null>(null);

  // ── Notificações ─────────────────────────────────────────────────────────
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifSms, setNotifSms] = useState(true);

  // ─────────────────────────────────────────────────────────────────────────
  // Redirecionar se não autenticado
  // ─────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push('/sou-cliente');
  }, [authLoading, isAuthenticated, router]);

  // ─────────────────────────────────────────────────────────────────────────
  // Carregar dados frescos da API
  // ─────────────────────────────────────────────────────────────────────────
  const load = useCallback(async () => {
    try {
      const res = await clientApi.get('/client/auth/me');
      const d: ClientData = res.data;
      setUserData(d);
      setNameValue(d.name || '');
      const rawPhone = d.phone || '';
      setPhoneValue(rawPhone.includes('@') ? '' : rawPhone);
      setNameBlockedDays(calcNameBlockedDays(d.nameChangedAt));
    } catch (e) {
      console.error('Erro ao carregar perfil:', e);
    } finally {
      setPageLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) load();
  }, [isAuthenticated, load]);

  // ─────────────────────────────────────────────────────────────────────────
  // Salvar Nome (regra 30 dias)
  // ─────────────────────────────────────────────────────────────────────────
  async function handleSaveName() {
    if (!nameValue.trim()) {
      setNameMsg({ type: 'err', text: 'O nome não pode estar vazio.' });
      return;
    }
    setSavingName(true);
    setNameMsg(null);
    try {
      const res = await clientApi.put('/client/auth/profile', { name: nameValue.trim() });
      const updated = res.data;

      // Atualizar sessionStorage
      const stored = sessionStorage.getItem('@barberFlow:client:user');
      if (stored) {
        const parsed = JSON.parse(stored);
        sessionStorage.setItem('@barberFlow:client:user', JSON.stringify({ ...parsed, name: updated.name }));
      }

      setUserData(prev => prev ? { ...prev, name: updated.name, nameChangedAt: updated.nameChangedAt } : prev);
      setNameBlockedDays(30);
      setEditingName(false);
      setNameMsg({ type: 'ok', text: 'Nome atualizado com sucesso!' });
      setTimeout(() => setNameMsg(null), 4000);
    } catch (e: any) {
      const msg = e.response?.data?.error || 'Não foi possível salvar o nome.';
      setNameMsg({ type: 'err', text: msg });
    } finally {
      setSavingName(false);
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Solicitar OTP por SMS
  // ─────────────────────────────────────────────────────────────────────────
  async function handleRequestOtp() {
    const clean = phoneValue.replace(/\D/g, '');
    if (clean.length < 10 || clean.length > 11) {
      setPhoneMsg({ type: 'err', text: 'Número inválido. Use DDD + número (ex: 11987654321).' });
      return;
    }
    setSendingOtp(true);
    setPhoneMsg(null);
    try {
      await clientApi.post('/client/auth/request-phone-verification', { phone: clean });
      setPhoneStep('sent');
      setPhoneMsg({ type: 'info', text: `Código enviado para ${formatPhone(clean)}. Válido por 15 minutos.` });
    } catch (e: any) {
      setPhoneMsg({ type: 'err', text: e.response?.data?.error || 'Erro ao enviar SMS.' });
    } finally {
      setSendingOtp(false);
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Verificar OTP e salvar telefone
  // ─────────────────────────────────────────────────────────────────────────
  async function handleVerifyOtp() {
    if (otpValue.length !== 6) {
      setPhoneMsg({ type: 'err', text: 'Digite o código de 6 dígitos.' });
      return;
    }
    setVerifyingOtp(true);
    setPhoneMsg(null);
    try {
      const clean = phoneValue.replace(/\D/g, '');
      const res = await clientApi.post('/client/auth/verify-phone', { phone: clean, otp: otpValue });
      const updated = res.data;

      // Atualizar sessionStorage
      const stored = sessionStorage.getItem('@barberFlow:client:user');
      if (stored) {
        const parsed = JSON.parse(stored);
        sessionStorage.setItem('@barberFlow:client:user', JSON.stringify({ ...parsed, phone: updated.phone }));
      }

      setUserData(prev => prev ? { ...prev, phone: updated.phone, phoneVerified: true } : prev);
      setPhoneValue(updated.phone || '');
      setOtpValue('');
      setPhoneStep('verified');
      setPhoneMsg({ type: 'ok', text: 'Telefone verificado e salvo com sucesso!' });
      setTimeout(() => { setPhoneMsg(null); setPhoneStep('idle'); }, 5000);
    } catch (e: any) {
      setPhoneMsg({ type: 'err', text: e.response?.data?.error || 'Código inválido ou expirado.' });
    } finally {
      setVerifyingOtp(false);
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Loading / Guard
  // ─────────────────────────────────────────────────────────────────────────
  if (authLoading || pageLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!isAuthenticated || !userData) return null;

  const hasPhone = !!userData.phone && !userData.phone.includes('@');
  const initial = (userData.name || 'C').charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-black text-white">

      {/* ── Header ── */}
      <header className="border-b border-gray-800 px-4 py-4 sticky top-0 bg-black z-10">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-800 rounded-lg transition"
            aria-label="Voltar"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-bold">Meu Perfil</h1>
            <p className="text-sm text-gray-400">Gerencie suas informações pessoais</p>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">

        {/* ── Avatar ── */}
        <div className="bg-[#151b23] rounded-2xl p-8 text-center border border-gray-800">
          <div className="relative inline-block mb-4">
            {userData.avatar ? (
              <img
                src={userData.avatar}
                alt={userData.name}
                className="w-24 h-24 rounded-full object-cover ring-4 ring-blue-600/30"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-4xl font-bold ring-4 ring-blue-600/30">
                {initial}
              </div>
            )}
          </div>
          <h2 className="text-2xl font-bold">{userData.name}</h2>
          <p className="text-gray-400 text-sm mt-1">{userData.email}</p>
          {userData.phoneVerified && (
            <span className="inline-flex items-center gap-1.5 mt-2 text-xs text-green-400 bg-green-400/10 px-3 py-1 rounded-full border border-green-400/20">
              <CheckCircle size={11} />
              Telefone verificado
            </span>
          )}
        </div>

        {/* ── Informações Pessoais ── */}
        <div className="bg-[#151b23] rounded-2xl p-6 border border-gray-800">
          <div className="flex items-center gap-2 mb-6">
            <User size={18} className="text-blue-500" />
            <h3 className="text-lg font-bold">Informações Pessoais</h3>
          </div>

          {/* NOME */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-400">Nome Completo</label>
              <div className="flex items-center gap-2">
                {nameBlockedDays ? (
                  <span className="inline-flex items-center gap-1.5 text-xs text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
                    <Clock size={11} />
                    Disponível em {nameBlockedDays}d
                  </span>
                ) : !editingName ? (
                  <button
                    onClick={() => setEditingName(true)}
                    className="text-xs text-blue-400 hover:text-blue-300 font-semibold transition"
                  >
                    Editar
                  </button>
                ) : null}
              </div>
            </div>

            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
              <input
                type="text"
                value={nameValue}
                onChange={e => setNameValue(e.target.value)}
                disabled={!editingName || !!nameBlockedDays}
                className="w-full bg-[#1f2937] border border-gray-700 rounded-xl pl-10 pr-4 py-3 text-white text-sm disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:border-blue-500 transition"
              />
            </div>

            {nameBlockedDays && userData?.nameChangedAt && (
              <div className="mt-2 space-y-1">
                <p className="text-xs text-gray-500 flex items-center gap-1.5">
                  <Clock size={11} />
                  Alterado em: <span className="text-gray-400">{calcChangedDate(userData.nameChangedAt)}</span>
                </p>
                <p className="text-xs text-amber-500/80 flex items-center gap-1.5">
                  <Clock size={11} />
                  Próxima troca disponível em: <span className="text-amber-400 font-semibold">{calcNextChangeDate(userData.nameChangedAt)}</span>
                  <span className="text-gray-600">({nameBlockedDays} dia(s))</span>
                </p>
              </div>
            )}

            {nameMsg && (
              <p className={`text-xs mt-2 flex items-center gap-1.5 ${nameMsg.type === 'ok' ? 'text-green-400' : 'text-red-400'
                }`}>
                {nameMsg.type === 'ok' ? <CheckCircle size={11} /> : '⚠️'}
                {nameMsg.text}
              </p>
            )}

            {editingName && !nameBlockedDays && (
              <div className="flex gap-3 mt-3">
                <button
                  onClick={() => { setEditingName(false); setNameValue(userData.name || ''); setNameMsg(null); }}
                  className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 py-2.5 rounded-xl text-sm font-semibold transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveName}
                  disabled={savingName}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white py-2.5 rounded-xl text-sm font-semibold transition flex items-center justify-center gap-2"
                >
                  {savingName ? (
                    <><div className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full" />Salvando...</>
                  ) : 'Salvar Nome'}
                </button>
              </div>
            )}
          </div>

          {/* E-MAIL */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-400">E-mail</label>
              <span className="inline-flex items-center gap-1.5 text-xs text-gray-500 bg-gray-800 px-3 py-1 rounded-full border border-gray-700">
                <Lock size={10} />
                Alterar em breve
              </span>
            </div>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
              <input
                type="email"
                value={userData.email || ''}
                disabled
                className="w-full bg-[#1f2937] border border-gray-700 rounded-xl pl-10 pr-4 py-3 text-gray-500 text-sm disabled:cursor-not-allowed"
              />
            </div>
            <p className="text-xs text-gray-600 mt-1.5">
              A alteração de e-mail estará disponível em breve com confirmação via link.
            </p>
          </div>

          {/* TELEFONE */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-400">Telefone</label>
              <div className="flex items-center gap-2">
                {(phoneStep === 'verified' || userData.phoneVerified) && phoneStep !== 'entering' && (
                  <span className="inline-flex items-center gap-1.5 text-xs text-green-400 bg-green-400/10 px-3 py-1 rounded-full border border-green-400/20">
                    <CheckCircle size={11} />
                    Verificado
                  </span>
                )}
                {phoneStep === 'idle' && hasPhone && (
                  <button
                    onClick={() => { setPhoneStep('entering'); setPhoneMsg(null); }}
                    className="text-xs text-blue-400 hover:text-blue-300 font-semibold transition"
                  >
                    Editar
                  </button>
                )}
              </div>
            </div>

            {/* Telefone somente leitura */}
            {phoneStep === 'idle' && hasPhone && (
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                <input
                  type="tel"
                  value={formatPhone(userData.phone || '')}
                  disabled
                  className="w-full bg-[#1f2937] border border-gray-700 rounded-xl pl-10 pr-4 py-3 text-gray-500 text-sm disabled:cursor-not-allowed"
                />
              </div>
            )}

            {/* Input novo número */}
            {(phoneStep === 'entering' || (phoneStep === 'idle' && !hasPhone)) && (
              <div>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                    <input
                      type="tel"
                      value={phoneValue}
                      onChange={e => setPhoneValue(e.target.value)}
                      placeholder="(11) 99999-9999"
                      className="w-full bg-[#1f2937] border border-gray-700 rounded-xl pl-10 pr-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500 transition"
                    />
                  </div>
                  <button
                    onClick={handleRequestOtp}
                    disabled={sendingOtp}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white px-4 py-3 rounded-xl text-sm font-semibold transition flex items-center gap-2 whitespace-nowrap"
                  >
                    {sendingOtp ? (
                      <div className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full" />
                    ) : 'Enviar SMS'}
                  </button>
                </div>
                {phoneStep === 'entering' && (
                  <button
                    onClick={() => { setPhoneStep('idle'); setPhoneMsg(null); }}
                    className="text-xs text-gray-500 hover:text-gray-400 mt-2 underline"
                  >
                    Cancelar
                  </button>
                )}
                <p className="text-xs text-gray-500 mt-1.5 flex items-center gap-1">
                  <Shield size={11} />
                  Você receberá um código SMS para confirmar o número.
                </p>
              </div>
            )}

            {/* Verificação OTP */}
            {phoneStep === 'sent' && (
              <div className="mt-3">
                <p className="text-xs text-blue-400 mb-3 flex items-center gap-1.5">
                  <CheckCircle size={12} />
                  Código enviado! Verifique seu SMS.
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={otpValue}
                    onChange={e => setOtpValue(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="000000"
                    maxLength={6}
                    className="flex-1 bg-[#1f2937] border border-gray-700 rounded-xl px-4 py-3 text-white text-center text-xl font-bold tracking-[0.5em] focus:outline-none focus:border-blue-500 transition"
                  />
                  <button
                    onClick={handleVerifyOtp}
                    disabled={verifyingOtp || otpValue.length !== 6}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-green-600/40 text-white px-4 py-3 rounded-xl text-sm font-semibold transition flex items-center gap-2"
                  >
                    {verifyingOtp ? (
                      <div className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full" />
                    ) : 'Confirmar'}
                  </button>
                </div>
                <button
                  onClick={handleRequestOtp}
                  disabled={sendingOtp}
                  className="text-xs text-gray-500 hover:text-gray-400 mt-2 underline"
                >
                  {sendingOtp ? 'Reenviando...' : 'Reenviar código'}
                </button>
              </div>
            )}

            {/* Mensagem telefone */}
            {phoneMsg && (
              <p className={`text-xs mt-2 flex items-center gap-1.5 ${phoneMsg.type === 'ok' ? 'text-green-400' :
                phoneMsg.type === 'info' ? 'text-blue-400' : 'text-red-400'
                }`}>
                {phoneMsg.type === 'ok' && <CheckCircle size={11} />}
                {phoneMsg.text}
              </p>
            )}
          </div>
        </div>

        {/* ── Notificações ── */}
        <div className="bg-[#151b23] rounded-2xl p-6 border border-gray-800">
          <div className="flex items-center gap-2 mb-5">
            <Bell size={18} className="text-blue-500" />
            <h3 className="text-lg font-bold">Notificações</h3>
          </div>

          <div className="space-y-1">
            <label className="flex items-center justify-between py-3 border-b border-gray-800 cursor-pointer group">
              <div>
                <p className="font-medium text-sm group-hover:text-blue-400 transition">E-mail</p>
                <p className="text-xs text-gray-500">Lembretes de agendamentos</p>
              </div>
              <div
                onClick={() => setNotifEmail(v => !v)}
                className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${notifEmail ? 'bg-blue-600' : 'bg-gray-700'
                  }`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${notifEmail ? 'translate-x-6' : 'translate-x-1'
                  }`} />
              </div>
            </label>

            <label className="flex items-center justify-between py-3 cursor-pointer group">
              <div>
                <p className="font-medium text-sm group-hover:text-blue-400 transition">SMS</p>
                <p className="text-xs text-gray-500">Confirmações e lembretes via SMS</p>
              </div>
              <div
                onClick={() => setNotifSms(v => !v)}
                className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${notifSms ? 'bg-blue-600' : 'bg-gray-700'
                  }`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${notifSms ? 'translate-x-6' : 'translate-x-1'
                  }`} />
              </div>
            </label>
          </div>
        </div>

        {/* ── Atalhos ── */}
        <div className="bg-[#151b23] rounded-2xl overflow-hidden border border-gray-800">
          {[
            { icon: '📅', label: 'Meus Agendamentos', href: '/meus-agendamentos' },
            { icon: '❤️', label: 'Meus Favoritos', href: '/meus-favoritos' },
          ].map((item, i, arr) => (
            <a
              key={item.href}
              href={item.href}
              className={`flex items-center gap-4 px-6 py-4 hover:bg-gray-800/50 transition ${i < arr.length - 1 ? 'border-b border-gray-800' : ''
                }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="flex-1 text-sm font-medium">{item.label}</span>
              <ArrowLeft size={16} className="text-gray-600 rotate-180" />
            </a>
          ))}
        </div>

      </div>
    </div>
  );
}