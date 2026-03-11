// Danh sách danh mục sách được sử dụng chung cho toàn bộ ứng dụng

export const CATEGORIES = [
  { value: 'fiction', label: 'Văn học' },
  { value: 'business', label: 'Kinh doanh' },
  { value: 'technology', label: 'Công nghệ' },
  { value: 'self-help', label: 'Phát triển bản thân' },
  { value: 'romance', label: 'Lãng mạn' },
  { value: 'horror', label: 'Kinh dị' },
  { value: 'adventure', label: 'Phiêu lưu' },
  { value: 'science', label: 'Khoa học' },
  { value: 'history', label: 'Lịch sử' },
  { value: 'biography', label: 'Tiểu sử' },
  { value: 'psychology', label: 'Tâm lý học' },
  { value: 'health', label: 'Sức khỏe' },
  { value: 'cooking', label: 'Nấu ăn' },
  { value: 'art', label: 'Nghệ thuật' },
  { value: 'children', label: 'Thiếu nhi' },
  { value: 'manga', label: 'Truyện tranh' },
  { value: 'travel', label: 'Du lịch' },
  { value: 'education', label: 'Giáo dục' },
  { value: 'religion', label: 'Tôn giáo' },
  { value: 'other', label: 'Khác' },
];

// Danh mục với icon và màu sắc cho trang Categories (user)
export const CATEGORIES_WITH_ICONS = [
  { 
    name: "Văn học", 
    nameEn: "fiction",
    icon: (
      <svg className="w-12 h-12 md:w-16 md:h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
      </svg>
    ),
    color: "from-purple-100 to-purple-50",
    hoverColor: "hover:from-purple-200 hover:to-purple-100",
    textColor: "text-purple-600"
  },
  { 
    name: "Kinh doanh", 
    nameEn: "business",
    icon: (
      <svg className="w-12 h-12 md:w-16 md:h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
      </svg>
    ),
    color: "from-amber-100 to-amber-50",
    hoverColor: "hover:from-amber-200 hover:to-amber-100",
    textColor: "text-amber-600"
  },
  { 
    name: "Công nghệ", 
    nameEn: "technology",
    icon: (
      <svg className="w-12 h-12 md:w-16 md:h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
      </svg>
    ),
    color: "from-blue-100 to-blue-50",
    hoverColor: "hover:from-blue-200 hover:to-blue-100",
    textColor: "text-blue-600"
  },
  { 
    name: "Phát triển bản thân", 
    nameEn: "self-help",
    icon: (
      <svg className="w-12 h-12 md:w-16 md:h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
      </svg>
    ),
    color: "from-yellow-100 to-yellow-50",
    hoverColor: "hover:from-yellow-200 hover:to-yellow-100",
    textColor: "text-yellow-600"
  },
  { 
    name: "Lãng mạn", 
    nameEn: "romance",
    icon: (
      <svg className="w-12 h-12 md:w-16 md:h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
      </svg>
    ),
    color: "from-pink-100 to-pink-50",
    hoverColor: "hover:from-pink-200 hover:to-pink-100",
    textColor: "text-pink-600"
  },
  { 
    name: "Kinh dị", 
    nameEn: "horror",
    icon: (
      <svg className="w-12 h-12 md:w-16 md:h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
      </svg>
    ),
    color: "from-gray-100 to-gray-50",
    hoverColor: "hover:from-gray-200 hover:to-gray-100",
    textColor: "text-gray-600"
  },
  { 
    name: "Phiêu lưu", 
    nameEn: "adventure",
    icon: (
      <svg className="w-12 h-12 md:w-16 md:h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
    ),
    color: "from-teal-100 to-teal-50",
    hoverColor: "hover:from-teal-200 hover:to-teal-100",
    textColor: "text-teal-600"
  },
  { 
    name: "Khoa học", 
    nameEn: "science",
    icon: (
      <svg className="w-12 h-12 md:w-16 md:h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/>
      </svg>
    ),
    color: "from-green-100 to-green-50",
    hoverColor: "hover:from-green-200 hover:to-green-100",
    textColor: "text-green-600"
  },
  { 
    name: "Lịch sử", 
    nameEn: "history",
    icon: (
      <svg className="w-12 h-12 md:w-16 md:h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
    ),
    color: "from-rose-100 to-rose-50",
    hoverColor: "hover:from-rose-200 hover:to-rose-100",
    textColor: "text-rose-600"
  },
  { 
    name: "Tiểu sử", 
    nameEn: "biography",
    icon: (
      <svg className="w-12 h-12 md:w-16 md:h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
      </svg>
    ),
    color: "from-cyan-100 to-cyan-50",
    hoverColor: "hover:from-cyan-200 hover:to-cyan-100",
    textColor: "text-cyan-600"
  },
  { 
    name: "Tâm lý học", 
    nameEn: "psychology",
    icon: (
      <svg className="w-12 h-12 md:w-16 md:h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
      </svg>
    ),
    color: "from-indigo-100 to-indigo-50",
    hoverColor: "hover:from-indigo-200 hover:to-indigo-100",
    textColor: "text-indigo-600"
  },
  { 
    name: "Sức khỏe", 
    nameEn: "health",
    icon: (
      <svg className="w-12 h-12 md:w-16 md:h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
      </svg>
    ),
    color: "from-emerald-100 to-emerald-50",
    hoverColor: "hover:from-emerald-200 hover:to-emerald-100",
    textColor: "text-emerald-600"
  },
  { 
    name: "Nấu ăn", 
    nameEn: "cooking",
    icon: (
      <svg className="w-12 h-12 md:w-16 md:h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/>
      </svg>
    ),
    color: "from-lime-100 to-lime-50",
    hoverColor: "hover:from-lime-200 hover:to-lime-100",
    textColor: "text-lime-600"
  },
  { 
    name: "Nghệ thuật", 
    nameEn: "art",
    icon: (
      <svg className="w-12 h-12 md:w-16 md:h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"/>
      </svg>
    ),
    color: "from-fuchsia-100 to-fuchsia-50",
    hoverColor: "hover:from-fuchsia-200 hover:to-fuchsia-100",
    textColor: "text-fuchsia-600"
  },
  { 
    name: "Thiếu nhi", 
    nameEn: "children",
    icon: (
      <svg className="w-12 h-12 md:w-16 md:h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
    ),
    color: "from-orange-100 to-orange-50",
    hoverColor: "hover:from-orange-200 hover:to-orange-100",
    textColor: "text-orange-600"
  },
  { 
    name: "Truyện tranh", 
    nameEn: "manga",
    icon: (
      <svg className="w-12 h-12 md:w-16 md:h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
      </svg>
    ),
    color: "from-red-100 to-red-50",
    hoverColor: "hover:from-red-200 hover:to-red-100",
    textColor: "text-red-600"
  },
  { 
    name: "Du lịch", 
    nameEn: "travel",
    icon: (
      <svg className="w-12 h-12 md:w-16 md:h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
    ),
    color: "from-sky-100 to-sky-50",
    hoverColor: "hover:from-sky-200 hover:to-sky-100",
    textColor: "text-sky-600"
  },
  { 
    name: "Giáo dục", 
    nameEn: "education",
    icon: (
      <svg className="w-12 h-12 md:w-16 md:h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5z"/>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"/>
      </svg>
    ),
    color: "from-violet-100 to-violet-50",
    hoverColor: "hover:from-violet-200 hover:to-violet-100",
    textColor: "text-violet-600"
  },
  { 
    name: "Tôn giáo", 
    nameEn: "religion",
    icon: (
      <svg className="w-12 h-12 md:w-16 md:h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
      </svg>
    ),
    color: "from-slate-100 to-slate-50",
    hoverColor: "hover:from-slate-200 hover:to-slate-100",
    textColor: "text-slate-600"
  },
  { 
    name: "Khác", 
    nameEn: "other",
    icon: (
      <svg className="w-12 h-12 md:w-16 md:h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"/>
      </svg>
    ),
    color: "from-neutral-100 to-neutral-50",
    hoverColor: "hover:from-neutral-200 hover:to-neutral-100",
    textColor: "text-neutral-600"
  },
];

// Helper function: Lấy label từ value
export const getCategoryLabel = (value) => {
  const category = CATEGORIES.find(cat => cat.value === value);
  return category ? category.label : value;
};

// Helper function: Lấy value từ label
export const getCategoryValue = (label) => {
  const category = CATEGORIES.find(cat => cat.label === label);
  return category ? category.value : label;
};
