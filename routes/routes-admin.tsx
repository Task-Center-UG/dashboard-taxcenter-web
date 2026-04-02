import {
  LayoutDashboard,
  Layers,
  Award,
  Network,
  Handshake,
  HeartHandshake,
  BookOpen,
  HelpingHand,
  Store,
  Presentation,
  Camera,
  Microscope,
  Tags,
  Stethoscope,
  CalendarDays,
  Newspaper,
  Globe,
  Mic,
  Video,
  Image as ImageIcon,
  User2,
  BookAIcon,
  FileImage,
  ClipboardList,
  GraduationCap,
  LucideIcon,
  Users,
  UserPlus,
  BookText,
  VideoIcon,
  ListTodo,
} from "lucide-react";

export interface NavSubItem {
  title: string;
  url: string;
  icon?: LucideIcon;
}

export interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
  items?: NavSubItem[];
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const routesAdmin: { navGroups: NavGroup[] } = {
  navGroups: [
    {
      label: "HOME",
      items: [
        {
          title: "Dashboard",
          url: "/dashboard",
          icon: LayoutDashboard,
        },
        {
          title: "Pengguna",
          url: "/dashboard/users",
          icon: User2,
        },
      ],
    },
    {
      label: "BERANDA",
      items: [
        {
          title: "Hero Slider",
          url: "/dashboard/home/sliders",
          icon: Layers,
        },
        {
          title: "Penghargaan",
          url: "/dashboard/home/awwards",
          icon: Award,
        },
        {
          title: "Company Profile Video",
          url: "/dashboard/home/company-profile-video",
          icon: Video,
        },
      ],
    },
    {
      label: "TENTANG KAMI",
      items: [
        {
          title: "Struktur Organisasi",
          url: "#",
          icon: Network,
          items: [
            {
              title: "Divisi",
              url: "/dashboard/organizations/divisions",
              icon: Users,
            },
            {
              title: "Asisten Divisi",
              url: "/dashboard/organizations/division-assistants",
              icon: UserPlus,
            },
          ],
        },
      ],
    },
    {
      label: "PROGRAM DAN LAYANAN",
      items: [
        {
          title: "Relawan Pajak",
          url: "#",
          icon: HeartHandshake,
          items: [
            {
              title: "Module",
              url: "/dashboard/tax-volunteers/modules",
              icon: BookText,
            },
            {
              title: "Relawan Pajak MBKM",
              url: "/dashboard/tax-volunteers/mbkm",
              icon: GraduationCap,
            },
            {
              title: "Relawan Pajak NON MBKM",
              url: "/dashboard/tax-volunteers/non-mbkm",
              icon: User2,
            },
            {
              title: "Kegiatan Relpak",
              url: "/dashboard/tax-volunteers/activities",
              icon: ClipboardList,
            },
            {
              title: "Dokumentasi",
              url: "/dashboard/tax-volunteers/documentations",
              icon: FileImage,
            },
          ],
        },
        {
          title: "Pengabdian Masyarakat",
          url: "#",
          icon: HelpingHand,
          items: [
            {
              title: "Pendampingan UMKM",
              url: "/dashboard/service/msme-mentoring",
              icon: Store,
            },
            {
              title: "Pelatihan/Workshop UMKM",
              url: "/dashboard/service/training",
              icon: Presentation,
            },
            {
              title: "Foto Produk UMKM",
              url: "/dashboard/service/msme-product-photos",
              icon: Camera,
            },
          ],
        },
        {
          title: "Riset",
          url: "#",
          icon: Microscope,
          items: [
            {
              title: "Kategori Penelitian",
              url: "/dashboard/research/research-categories",
              icon: Tags,
            },
            {
              title: "Kerja Sama Riset",
              url: "/dashboard/research/research-collaborations",
              icon: Handshake,
            },
          ],
        },
        {
          title: "Tax Clinic",
          url: "#",
          icon: Stethoscope,
          items: [
            {
              title: "Layanan Tax Clinic",
              url: "/dashboard/tax-clinic/services",
              icon: VideoIcon,
            },
          ],
        },
      ],
    },
    {
      label: "KEGIATAN DAN BERITA",
      items: [
        {
          title: "Agenda Kegiatan",
          url: "#",
          icon: CalendarDays,
          items: [
            {
              title: "Slider",
              url: "/dashboard/activities/sliders",
              icon: BookAIcon,
            },
            {
              title: "Kegiatan Terbaru",
              url: "/dashboard/activities/news",
              icon: Newspaper,
            },
            {
              title: "Seminar",
              url: "/dashboard/activities/seminars",
              icon: GraduationCap,
            },
            {
              title: "FGD",
              url: "/dashboard/activities/fgd",
              icon: ListTodo,
            },
          ],
        },
        {
          title: "Artikel Pajak",
          url: "/dashboard/activities/articles",
          icon: Newspaper,
        },
        {
          title: "Publikasi",
          url: "/dashboard/activities/publications",
          icon: Globe,
        },
      ],
    },
    {
      label: "EDUKASI PAJAK",
      items: [
        {
          title: "Materi Pajak",
          url: "/dashboard/tax-education/materials",
          icon: BookOpen,
        },
        {
          title: "Bincang Sore & Podcast",
          url: "/dashboard/tax-education/afternoon-talks",
          icon: Mic,
        },
        {
          title: "Video Pembelajaran Pajak",
          url: "/dashboard/tax-education/learning-videos",
          icon: Video,
        },
      ],
    },
    {
      label: "GALERI",
      items: [
        {
          title: "Foto Kegiatan",
          url: "/dashboard/galleries",
          icon: ImageIcon,
        },
      ],
    },
  ],
};
