interface ConfigData {
  heroImage: string;
  heroTitle: string;
  heroSubtitle: string;
  description: string;
  galleryImages: string[];
  businessHours: Record<string, string>;
  instagramUrl: string;
  facebookUrl: string;
  whatsappNumber: string;
  youtubeUrl: string;
  primaryColor: string;
  secondaryColor: string;
  showTeam: boolean;
  showGallery: boolean;
  showReviews: boolean;
  allowOnlineBooking: boolean;
}

interface CompletionResult {
  percentage: number;
  missingFields: string[];
  completedFields: number;
  totalFields: number;
}

export function calculateCompletion(config: ConfigData, logoUrl?: string | null): CompletionResult {
  const checks = [
    { field: 'Logo da barbearia', value: logoUrl },
    { field: 'Imagem principal (Hero)', value: config.heroImage },
    { field: 'Título principal', value: config.heroTitle },
    { field: 'Subtítulo', value: config.heroSubtitle },
    { field: 'Descrição sobre a barbearia', value: config.description },
    { field: 'Pelo menos 3 fotos na galeria', value: config.galleryImages.length >= 3 },
    { field: 'Instagram', value: config.instagramUrl },
    { field: 'WhatsApp', value: config.whatsappNumber },
    { field: 'Horários de funcionamento configurados', value: Object.keys(config.businessHours).length > 0 },
  ];

  const missingFields: string[] = [];
  let completedFields = 0;

  checks.forEach((check) => {
    if (check.value) {
      completedFields++;
    } else {
      missingFields.push(check.field);
    }
  });

  const totalFields = checks.length;
  const percentage = Math.round((completedFields / totalFields) * 100);

  return {
    percentage,
    missingFields,
    completedFields,
    totalFields
  };
}