import type { SellerStatus } from 'src/interfaces/seller/seller-status';

// ----------------------------------------------------------------------

export type AcademyLevel = 'beginner' | 'intermediate' | 'advanced';

export interface AcademyLesson {
  id: string;
  title: string;
  /** URL embebible (YouTube /embed/, Vimeo player, etc.) */
  videoUrl: string;
  /** Duración en minutos. */
  durationMinutes: number;
  description: string;
}

export interface AcademyCourse {
  id: string;
  /** Clave i18n del título: `academyModule.courses.<id>.title`. */
  titleKey: string;
  /** Clave i18n de la descripción corta: `academyModule.courses.<id>.description`. */
  descriptionKey: string;
  thumbnail: string;
  level: AcademyLevel;
  /**
   * Si está presente, el curso solo se muestra cuando el seller está en uno
   * de estos estados (típicamente `APPROVED` para contenido avanzado).
   * Si está ausente, el curso es visible para cualquier estado.
   */
  visibleForStatuses?: SellerStatus[];
  lessons: AcademyLesson[];
}
