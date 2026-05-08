import type { AcademyCourse } from '../types';

import { SELLER_STATUS } from 'src/interfaces/seller/seller-status';

// ----------------------------------------------------------------------
// Catálogo estático de cursos. Migrar a backend cuando exista el endpoint.
// Las URLs son YouTube embed (Big Buck Bunny / Sintel — videos abiertos
// estables) usados como placeholder hasta tener el contenido real.
// ----------------------------------------------------------------------

const PLACEHOLDER_VIDEO = 'https://www.youtube.com/embed/aqz-KE-bpKQ';
const PLACEHOLDER_VIDEO_2 = 'https://www.youtube.com/embed/eRsGyueVLvQ';

export const ACADEMY_COURSES: AcademyCourse[] = [
  {
    id: 'getting-started',
    titleKey: 'academyModule.courses.gettingStarted.title',
    descriptionKey: 'academyModule.courses.gettingStarted.description',
    thumbnail: '/assets/images/academy/getting-started.svg',
    level: 'beginner',
    lessons: [
      {
        id: 'welcome',
        title: 'Bienvenido a Miti Miti Seller Center',
        videoUrl: PLACEHOLDER_VIDEO,
        durationMinutes: 4,
        description:
          'Conoce el panorama general de la plataforma y qué puedes hacer desde tu primer día.',
      },
      {
        id: 'profile-setup',
        title: 'Configura tu perfil de vendedor',
        videoUrl: PLACEHOLDER_VIDEO_2,
        durationMinutes: 6,
        description: 'Completa los datos básicos de tu negocio y deja todo listo para vender.',
      },
      {
        id: 'navigation',
        title: 'Navegación por los módulos',
        videoUrl: PLACEHOLDER_VIDEO,
        durationMinutes: 5,
        description: 'Recorre los módulos principales: productos, órdenes, devoluciones y más.',
      },
    ],
  },
  {
    id: 'catalog-management',
    titleKey: 'academyModule.courses.catalogManagement.title',
    descriptionKey: 'academyModule.courses.catalogManagement.description',
    thumbnail: '/assets/images/academy/catalog.svg',
    level: 'beginner',
    lessons: [
      {
        id: 'create-simple-product',
        title: 'Crear tu primer producto simple',
        videoUrl: PLACEHOLDER_VIDEO,
        durationMinutes: 8,
        description: 'Aprende a crear un producto simple desde cero con todos los campos clave.',
      },
      {
        id: 'create-configurable-product',
        title: 'Productos configurables (variantes)',
        videoUrl: PLACEHOLDER_VIDEO_2,
        durationMinutes: 10,
        description: 'Talla, color, sabor — gestiona variantes sin perder la cabeza.',
      },
      {
        id: 'bulk-upload',
        title: 'Carga masiva por archivo',
        videoUrl: PLACEHOLDER_VIDEO,
        durationMinutes: 7,
        description: 'Importa cientos de productos en minutos usando la plantilla.',
      },
    ],
  },
  {
    id: 'orders-fulfillment',
    titleKey: 'academyModule.courses.ordersFulfillment.title',
    descriptionKey: 'academyModule.courses.ordersFulfillment.description',
    thumbnail: '/assets/images/academy/orders.svg',
    level: 'intermediate',
    lessons: [
      {
        id: 'order-lifecycle',
        title: 'Ciclo de vida de una orden',
        videoUrl: PLACEHOLDER_VIDEO,
        durationMinutes: 6,
        description: 'De pago confirmado a entregado: cada estado y qué hacer en él.',
      },
      {
        id: 'shipping-labels',
        title: 'Genera e imprime guías de envío',
        videoUrl: PLACEHOLDER_VIDEO_2,
        durationMinutes: 5,
        description: 'Selecciona órdenes y genera guías en lote para acelerar tu operación.',
      },
    ],
  },
  // ---- Solo visible cuando el seller está APROBADO (AC#3 de la HU) -----
  {
    id: 'advanced-growth',
    titleKey: 'academyModule.courses.advancedGrowth.title',
    descriptionKey: 'academyModule.courses.advancedGrowth.description',
    thumbnail: '/assets/images/academy/growth.svg',
    level: 'advanced',
    visibleForStatuses: [SELLER_STATUS.APPROVED],
    lessons: [
      {
        id: 'campaigns',
        title: 'Crea campañas y promociones',
        videoUrl: PLACEHOLDER_VIDEO,
        durationMinutes: 9,
        description: 'Estrategias de descuentos, cupones y campañas estacionales.',
      },
      {
        id: 'analytics-deep-dive',
        title: 'Lee tus métricas como un pro',
        videoUrl: PLACEHOLDER_VIDEO_2,
        durationMinutes: 12,
        description: 'Conversión, ticket promedio y reputación: qué optimizar primero.',
      },
    ],
  },
];

// ----------------------------------------------------------------------

export const findCourseById = (id: string): AcademyCourse | undefined =>
  ACADEMY_COURSES.find((course) => course.id === id);

export const findLessonInCourse = (
  course: AcademyCourse,
  lessonId: string
): { lesson: AcademyCourse['lessons'][number]; index: number } | undefined => {
  const index = course.lessons.findIndex((lesson) => lesson.id === lessonId);
  if (index === -1) return undefined;
  return { lesson: course.lessons[index], index };
};
