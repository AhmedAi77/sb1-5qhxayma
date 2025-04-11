import React, { createContext, useContext, useState } from 'react';

type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Define a type for our translations
type TranslationKeys = 
  | 'signup.title' | 'signup.name' | 'signup.namePlaceholder' | 'signup.password'
  | 'signup.passwordPlaceholder' | 'signup.submit' | 'signup.login' | 'signup.processing'
  | 'signup.haveAccount' | 'signup.needAccount' | 'welcome.title' | 'welcome.subtitle'
  | 'header.level' | 'header.hunter' | 'header.stats' | 'header.favorites'
  | 'header.missions' | 'header.logout' | 'mission.title' | 'mission.exp'
  | 'mission.reps' | 'mission.run' | 'mission.miles' | 'mission.seconds'
  | 'mission.completed' | 'mission.processing' | 'mission.start' | 'exercise.completed'
  | 'level.up' | 'stats.title' | 'stats.totalExercises' | 'stats.totalReps'
  | 'stats.totalDistance' | 'stats.miles' | 'stats.seconds' | 'stats.miles.short'
  | 'stats.reps' | 'stats.personalBests' | 'stats.bestReps' | 'stats.recentActivity'
  | 'stats.noBests' | 'stats.noActivity' | 'favorites.title' | 'favorites.empty'
  | 'favorites.emptyMessage' | 'favorites.best' | 'favorites.timesPerformed'
  | 'favorites.lastPerformed' | 'favorites.remove' | 'favorites.exerciseDetails'
  | 'favorites.statisticsTitle' | 'favorites.progressTitle' | 'favorites.strengthLevel'
  | 'favorites.beginner' | 'favorites.intermediate' | 'favorites.advanced'
  | 'common.back' | 'language.toggle'
  // System quotes and mission text
  | 'Your strength is not just in your muscles, but in your determination to push beyond limits.'
  | 'Every rep brings you closer to your potential. Push harder, achieve more.'
  | 'The master of physical training understands that consistency creates power.'
  | 'Daily Training Challenge'
  | 'Push Your Limits'
  | 'Core Strength Builder'
  | 'Endurance Test'
  | 'Full Body Circuit'
  | 'experience.progress' | 'experience.level' | 'experience.to_next' | 'experience.earned';

type TranslationsType = {
  [key in Language]: Record<string, string>
};

const translations: TranslationsType = {
  en: {
    // Auth
    'signup.title': 'ARISE',
    'signup.name': 'Enter your name, hunter',
    'signup.namePlaceholder': 'Your name',
    'signup.password': 'Enter password',
    'signup.passwordPlaceholder': 'Password',
    'signup.submit': 'Begin Training',
    'signup.login': 'Continue Training',
    'signup.processing': 'Processing...',
    'signup.haveAccount': 'Already have an account? Login',
    'signup.needAccount': 'Need an account? Sign up',
    
    // Welcome
    'welcome.title': 'WELCOME TO THE SYSTEM',
    'welcome.subtitle': 'Your journey begins now, hunter',
    
    // Header
    'header.level': 'LEVEL',
    'header.hunter': 'HUNTER',
    'header.stats': 'STATS',
    'header.favorites': 'FAVORITES',
    'header.missions': 'MISSIONS',
    'header.logout': 'LOGOUT',
    
    // Mission
    'mission.title': 'SYSTEM',
    'mission.exp': 'EXP',
    'mission.reps': 'reps',
    'mission.run': 'run',
    'mission.miles': 'miles',
    'mission.seconds': 'seconds',
    'mission.completed': 'Mission Completed!',
    'mission.processing': 'Processing...',
    'mission.start': 'START',
    
    // Exercise
    'exercise.completed': 'Exercise completed!',
    'level.up': 'Level up to',
    
    // Stats
    'stats.title': 'TRAINING STATS',
    'stats.totalExercises': 'Total Exercises',
    'stats.totalReps': 'Total Reps',
    'stats.totalDistance': 'Total Distance',
    'stats.miles': 'Running Miles',
    'stats.seconds': 'seconds',
    'stats.miles.short': 'mi',
    'stats.reps': 'reps',
    'stats.personalBests': 'PERSONAL BESTS',
    'stats.bestReps': 'Best reps',
    'stats.recentActivity': 'RECENT ACTIVITY',
    'stats.noBests': 'No personal bests yet',
    'stats.noActivity': 'No activity yet',
    
    // Favorites
    'favorites.title': 'FAVORITE EXERCISES',
    'favorites.empty': 'No favorite exercises yet',
    'favorites.emptyMessage': 'Star exercises from training to add them to favorites',
    'favorites.best': 'BEST',
    'favorites.timesPerformed': 'Times performed',
    'favorites.lastPerformed': 'Last performed',
    'favorites.remove': 'Remove from favorites',
    'favorites.add': 'Add to favorites',
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
    'language.toggle': 'العربية',
    
    // System quotes
    'Your strength is not just in your muscles, but in your determination to push beyond limits.': 'Your strength is not just in your muscles, but in your determination to push beyond limits.',
    'Every rep brings you closer to your potential. Push harder, achieve more.': 'Every rep brings you closer to your potential. Push harder, achieve more.',
    'The master of physical training understands that consistency creates power.': 'The master of physical training understands that consistency creates power.',
    
    // Mission titles
    'Daily Training Challenge': 'Daily Training Challenge',
    'Push Your Limits': 'Push Your Limits',
    'Core Strength Builder': 'Core Strength Builder',
    'Endurance Test': 'Endurance Test',
    'Full Body Circuit': 'Full Body Circuit',
    
    // Experience
    'experience.progress': 'XP Progress',
    'experience.level': 'LEVEL',
    'experience.to_next': 'to next level',
    'experience.earned': 'Experience earned'
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
    'mission.completed': 'تم إكمال المهمة!',
    'mission.processing': 'جاري التنفيذ...',
    'mission.start': 'ابدأ',
    
    // Exercise
    'exercise.completed': 'تم إكمال التمرين!',
    'level.up': 'ارتقيت إلى المستوى',
    
    // Stats
    'stats.title': 'إحصائيات التدريب',
    'stats.totalExercises': 'مجموع التمارين',
    'stats.totalReps': 'مجموع التكرارات',
    'stats.totalDistance': 'المسافة الإجمالية',
    'stats.miles': 'أميال الجري',
    'stats.seconds': 'ثانية',
    'stats.miles.short': 'ميل',
    'stats.reps': 'تكرار',
    'stats.personalBests': 'أفضل النتائج الشخصية',
    'stats.bestReps': 'أفضل التكرارات',
    'stats.recentActivity': 'النشاط الأخير',
    'stats.noBests': 'لا توجد أفضل نتائج شخصية بعد',
    'stats.noActivity': 'لا يوجد نشاط بعد',
    
    // Favorites
    'favorites.title': 'التمارين المفضلة',
    'favorites.empty': 'لا توجد تمارين مفضلة بعد',
    'favorites.emptyMessage': 'قم بتمييز التمارين من التدريب لإضافتها إلى المفضلة',
    'favorites.best': 'الأفضل',
    'favorites.timesPerformed': 'مرات التنفيذ',
    'favorites.lastPerformed': 'آخر تنفيذ',
    'favorites.remove': 'إزالة من المفضلة',
    'favorites.add': 'إضافة إلى المفضلة',
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
    'language.toggle': 'English',
    
    // System quotes - Arabic translations
    'Your strength is not just in your muscles, but in your determination to push beyond limits.': 'قوتك ليست فقط في عضلاتك، بل في إصرارك على تجاوز الحدود.',
    'Every rep brings you closer to your potential. Push harder, achieve more.': 'كل تكرار يقربك من إمكاناتك. اضغط بقوة أكبر، حقق المزيد.',
    'The master of physical training understands that consistency creates power.': 'يفهم سيد التدريب البدني أن الاستمرارية تخلق القوة.',
    
    // Mission titles - Arabic translations
    'Daily Training Challenge': 'تحدي التدريب اليومي',
    'Push Your Limits': 'تجاوز حدودك',
    'Core Strength Builder': 'بناء قوة الجذع',
    'Endurance Test': 'اختبار التحمل',
    'Full Body Circuit': 'تمرين الجسم الكامل',
    
    // Experience
    'experience.progress': 'تقدم الخبرة',
    'experience.level': 'المستوى',
    'experience.to_next': 'للمستوى التالي',
    'experience.earned': 'الخبرة المكتسبة'
  }
};

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