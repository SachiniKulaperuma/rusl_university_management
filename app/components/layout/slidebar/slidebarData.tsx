export interface SidebarSubItem {
  id: string;
  title: string;
  path: string;
  number: number;
}

export interface SidebarItemData {
  id: string;
  title: string;
  path?: string;
  icon?: string;
  subItems?: SidebarSubItem[];
}

export const sidebarMenuData: SidebarItemData[] = [
  {
    id: "home",
    title: "Home",
    path: "/",
    icon: "fas fa-home",
  },
  {
    id: "registration-forms",
    title: "Registration Forms",
    icon: "fas fa-file-invoice",
    subItems: [
      {
        id: "student-personal-info",
        title: "Student Personal Information",
        path: "/registration?section=student-personal-info",
        number: 1,
      },
      {
        id: "id-card",
        title: "Application for the Student Identity card",
        path: "/registration?section=id-card",
        number: 2,
      },
      {
        id: "residential",
        title: "Application for Residential Facilities",
        path: "/registration?section=residential",
        number: 3,
      },
      {
        id: "sports",
        title: "Student Physical Attribute & Sport Achievement",
        path: "/registration?section=sports",
        number: 4,
      },
      {
        id: "special-skills",
        title: "Application for the Special Skills",
        path: "/registration?section=special-skills",
        number: 5,
      },
      {
        id: "bursary",
        title: "Application for Bursary",
        path: "/registration?section=bursary",
        number: 6,
      },
      {
        id: "mahapola",
        title: "Application for Mahapola",
        path: "/registration?section=mahapola",
        number: 7,
      },
      {
        id: "medical",
        title: "Medical Examination Report",
        path: "/registration?section=medical",
        number: 8,
      },
    ],
  },
];
