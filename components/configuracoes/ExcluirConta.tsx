'use client';

import { useState } from 'react';
import { Trash2, AlertTriangle, X, Lock, Loader2 } from 'lucide-react';

interface ExcluirContaProps {
  onDelete: (password: string) => Promise<void>;
}

export function ExcluirConta({ onDelete }: ExcluirContaProps) {
  const [showModal, setShowModal] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmText, setConfirmText] = useState('');
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (confirmText !== 'EXCLUIR') {
      alert('❌ Digite "EXCLUIR" para confirmar');
      return;
    }

    if (!password) {
      alert('❌ Digite sua senha para confirmar');
      return;
    }

    setDeleting(true);
    try {
      await onDelete(password);
      alert('✅ Conta excluída com sucesso');
      window.location.href = '/';
    } catch (error: any) {
      alert(`❌ ${error.message || 'Erro ao excluir conta'}`);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl p-6 border-2 border-red-200 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-red-100 rounded-xl">
            <Trash2 className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Zona de Perigo</h2>
            <p className="text-sm text-gray-600">Ações irreversíveis</p>
          </div>
        </div>

        {/* Aviso */}
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
          <div className="flex gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-red-900 font-semibold mb-2">
                Atenção: Esta ação é irreversível!
              </p>
              <ul className="text-sm text-red-700 space-y-1">
                <li>• Todos os dados da sua barbearia serão excluídos</li>
                <li>• Todos os agendamentos serão cancelados</li>
                <li>• Todos os barbeiros perderão acesso</li>
                <li>• Todos os clientes serão removidos</li>
                <li>• Sua landing page será desativada</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Botão Excluir */}
        <button
          onClick={() => setShowModal(true)}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl transition font-semibold shadow-lg"
        >
          <Trash2 className="w-5 h-5" />
          Excluir Conta Permanentemente
        </button>

        {/* LGPD Info */}
        <div className="mt-4 bg-gray-50 border border-gray-200 rounded-xl p-4">
          <p className="text-xs text-gray-600">
            <strong>Lei Geral de Proteção de Dados (LGPD):</strong> Ao excluir sua conta, todos os seus dados pessoais serão permanentemente removidos de nossos servidores em até 30 dias, conforme determina a legislação brasileira.
          </p>
        </div>
      </div>

      {/* Modal de Confirmação */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => !deleting && setShowModal(false)}
          />

          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-red-600 to-red-500 text-white p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-6 h-6" />
                  <h2 className="text-xl font-bold">Confirmar Exclusão</h2>
                </div>
                {!deleting && (
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-2 hover:bg-white/20 rounded-lg transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-sm text-red-900 font-semibold mb-2">
                  ⚠️ ATENÇÃO: Esta ação é IRREVERSÍVEL!
                </p>
                <p className="text-sm text-red-700">
                  Todos os seus dados, agendamentos, clientes e barbeiros serão permanentemente excluídos.
                </p>
              </div>

              {/* Confirmação de Texto */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Digite <span className="text-red-600">EXCLUIR</span> para confirmar
                </label>
                <input
                  type="text"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value.toUpperCase())}
                  placeholder="Digite EXCLUIR"
                  disabled={deleting}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none disabled:opacity-50 disabled:cursor-not-allowed uppercase"
                />
              </div>

              {/* Senha */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Digite sua senha para confirmar
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Sua senha"
                    disabled={deleting}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Botões */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  disabled={deleting}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleting || confirmText !== 'EXCLUIR' || !password}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition font-semibold"
                >
                  {deleting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Excluindo...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-5 h-5" />
                      Excluir Definitivamente
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}