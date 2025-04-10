import React, { createContext, useContext, useState } from 'react';

type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      <div dir={language === 'ar' ? 'rtl' : 'ltr'}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

const translations = {
  en: {
    // Auth
    'signup.title': 'ARISE',
    'signup.name': 'Enter your name, Hunter',
    'signup.namePlaceholder': 'Your name',
    'signup.password': 'Enter your password',
    'signup.passwordPlaceholder': 'Your password',
    'signup.submit': 'Begin Training',
    'signup.login': 'Continue Training',
    'signup.processing': 'Processing...',
    'signup.haveAccount': 'Already have an account? Sign in',
    'signup.needAccount': 'Need an account? Sign up',
    
    // Welcome
    'welcome.title': 'Welcome to the System',
    'welcome.subtitle': 'Your journey begins now, Hunter',
    
    // Header
    'header.level': 'Level',
    'header.hunter': 'Hunter',
    'header.stats': 'Stats',
    'header.favorites': 'Favorites',
    'header.missions': 'missions',
    'header.logout': 'Logout',
    
    // Mission
    'mission.title': 'System',
    'mission.exp': 'EXP',
    'mission.reps': 'reps',
    'mission.run': 'Run',
    'mission.miles': 'miles',
    'mission.seconds': 'seconds',
    'mission.completed': 'Completed',
    'mission.processing': 'Processing...',
    'mission.start': 'Start',
    
    // Stats
    'stats.title': 'Training Stats',
    'stats.exercises': 'Exercises',
    'stats.totalReps': 'Total Reps',
    'stats.miles': 'Miles Run',
    'stats.seconds': 'seconds',
    'stats.miles.short': 'mi',
    'stats.reps': 'reps',
    'stats.personalBests': 'Personal Bests',
    'stats.recentActivity': 'Recent Activity',
    
    // Favorites
    'favorites.title': 'Favorite Exercises',
    'favorites.empty': 'No favorite exercises yet',
    'favorites.emptyMessage': 'Star exercises from your training to add them to your favorites',
    'favorites.best': 'Best',
    'favorites.timesPerformed': 'performed',
    'favorites.lastPerformed': 'Last performed',
    'favorites.remove': 'Remove',
    'favorites.exerciseDetails': 'Exercise Details',
    'favorites.statisticsTitle': 'Statistics',
    'favorites.progressTitle': 'Progress',
    'favorites.strengthLevel': 'Strength Level',
    'favorites.beginner': 'Beginner',
    'favorites.intermediate': 'Intermediate',
    'favorites.advanced': 'Advanced',
    
    // Common
    'common.back': 'Back',
    
    // Language
    'language.toggle': 'العربية'
  },
  ar: {
    // Auth
    'signup.title': 'أرايز',
    'signup.name': 'أدخل اسمك، أيها الصياد',
    'signup.namePlaceholder': 'اسمك',
    'signup.password': 'أدخل كلمة المرور',
    'signup.passwordPlaceholder': 'كلمة المرور',
    'signup.submit': 'ابدأ التدريب',
    'signup.login': 'واصل التدريب',
    'signup.processing': 'جاري المعالجة...',
    'signup.haveAccount': 'لديك حساب بالفعل؟ تسجيل الدخول',
    'signup.needAccount': 'تحتاج حساب؟ اشترك الآن',
    
    // Welcome
    'welcome.title': 'مرحباً بك في النظام',
    'welcome.subtitle': 'رحلتك تبدأ الآن، أيها الصياد',
    
    // Header
    'header.level': 'المستوى',
    'header.hunter': 'صياد',
    'header.stats': 'الإحصائيات',
    'header.favorites': 'المفضلة',
    'header.missions': 'المهام',
    'header.logout': 'خروج',
    
    // Mission
    'mission.title': 'النظام',
    'mission.exp': 'خبرة',
    'mission.reps': 'تكرار',
    'mission.run': 'جري',
    'mission.miles': 'ميل',
    'mission.seconds': 'ثانية',
    'mission.completed': 'مكتمل',
    'mission.processing': 'جاري التنفيذ...',
    'mission.start': 'ابدأ',
    
    // Stats
    'stats.title': 'إحصائيات التدريب',
    'stats.exercises': 'التمارين',
    'stats.totalReps': 'مجموع التكرارات',
    'stats.miles': 'أميال الجري',
    'stats.seconds': 'ثانية',
    'stats.miles.short': 'ميل',
    'stats.reps': 'تكرار',
    'stats.personalBests': 'أفضل النتائج',
    'stats.recentActivity': 'النشاط الأخير',
    
    // Favorites
    'favorites.title': 'التمارين المفضلة',
    'favorites.empty': 'لا توجد تمارين مفضلة بعد',
    'favorites.emptyMessage': 'قم بتمييز التمارين من التدريب لإضافتها إلى المفضلة',
    'favorites.best': 'الأفضل',
    'favorites.timesPerformed': 'مرات التنفيذ',
    'favorites.lastPerformed': 'آخر تنفيذ',
    'favorites.remove': 'إزالة',
    'favorites.exerciseDetails': 'تفاصيل التمرين',
    'favorites.statisticsTitle': 'الإحصائيات',
    'favorites.progressTitle': 'التقدم',
    'favorites.strengthLevel': 'مستوى القوة',
    'favorites.beginner': 'مبتدئ',
    'favorites.intermediate': 'متوسط',
    'favorites.advanced': 'متقدم',
    
    // Common
    'common.back': 'رجوع',
    
    // Language
    'language.toggle': 'English'
  }
};