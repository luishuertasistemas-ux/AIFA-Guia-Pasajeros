export const LANGUAGES = ['ES', 'EN', 'FR', 'ZH'] as const;
export type Language = (typeof LANGUAGES)[number];

type RoleTranslation = {
  title: string;
  subtitle: string;
};

type TranslationDictionary = {
  welcome: {
    brand: string;
    title: string;
    description: string;
    start: string;
    languageLabel: string;
    languageNames: Record<Language, string>;
  };
  superCard: {
    title: string;
    description: string;
    action: string;
    ariaLabel: string;
  };
  navigation: {
    brand: string;
    heading: string;
    description: string;
    quickHelp: string;
    unknownQr: string;
    roles: Record<'arrival' | 'departure' | 'pickup' | 'tourism' | 'transport' | 'lost-items' | 'pets', RoleTranslation>;
  };
  services: {
    tiaTitle: string;
    tiaDescription: string;
    feedback: string;
  };
  scanner: {
    title: string;
    description: string;
    tagline: string;
    privacyNotice: string;
    allowCamera: string;
    close: string;
    cameraError: string;
    scanError: string;
  };
};

export const translations: Record<Language, TranslationDictionary> = {
  ES: {
    welcome: {
      brand: 'AIFA · Guía de pasajeros',
      title: '¡Te damos la bienvenida al AIFA!',
      description: 'Tu experiencia en el aeropuerto, guiada paso a paso con la tranquilidad y claridad que mereces.',
      start: 'Iniciar experiencia',
      languageLabel: 'Elige tu idioma',
      languageNames: { ES: 'Español', EN: 'English', FR: 'Français', ZH: '中文' }
    },
    superCard: {
      title: '¡ALTO! 📱 Vive la experiencia digital AIFA',
      description: 'Abre tu cámara, escanea los códigos del aeropuerto y navega en tiempo real desde tu celular.',
      action: 'Escanear QR',
      ariaLabel: 'Abrir el escáner QR'
    },
    navigation: {
      brand: 'AIFA · Guía de pasajeros',
      heading: '¿Cómo podemos ayudarte hoy?',
      description: 'Elige lo que necesitas y te orientamos en tu visita.',
      quickHelp: 'Ayuda rápida',
      unknownQr: 'Código QR leído, pero la ubicación no está registrada en la guía.',
      roles: {
        arrival: { title: 'Llegué en un vuelo', subtitle: 'Equipaje, migración y salida' },
        departure: { title: 'Voy a viajar', subtitle: 'Check-in, filtros y salas' },
        pickup: { title: 'Vengo por alguien', subtitle: 'Punto de encuentro y llegadas' },
        tourism: { title: 'Paseo y Turismo', subtitle: 'Museos, plaza y baños temáticos' },
        transport: { title: 'Transporte', subtitle: 'Opciones para continuar tu trayecto' },
        'lost-items': { title: 'Objetos olvidados', subtitle: 'Orientación para recuperar tus pertenencias' },
        pets: { title: 'Mascotas', subtitle: 'Viaja preparado con tu animal de compañía' }
      }
    },
    services: {
      tiaTitle: '💡 ¿Necesitas ayuda presencial?',
      tiaDescription: 'Cualquier persona que porte una credencial oficial TIA (prestadores de servicios, seguridad y atención) está capacitada y obligada a auxiliarte y guiarte de la mano dentro de las instalaciones del aeropuerto. ¡Acércate con total confianza!',
      feedback: 'Cuéntanos tu experiencia'
    },
    scanner: {
      title: 'Escanear ubicación',
      description: 'Apunta la cámara a un código QR de AIFA.',
      tagline: 'No controlas los tiempos de un vuelo, pero sí cómo aprovechas tu tiempo aquí. Escanea el código para ubicarte.',
      privacyNotice: 'Usamos tu cámara únicamente para escanear tu pase de abordar o código de ubicación. No guardamos ni transmitimos ninguna imagen.',
      allowCamera: 'Permitir cámara',
      close: 'Cerrar escáner',
      cameraError: 'No se pudo acceder a la cámara. Revisa los permisos del navegador.',
      scanError: 'No se pudo leer este código QR.'
    }
  },
  EN: {
    welcome: {
      brand: 'AIFA · Passenger Guide',
      title: 'Welcome to AIFA!',
      description: 'Your airport experience, guided step by step with the calm and clarity you deserve.',
      start: 'Start your experience',
      languageLabel: 'Select language',
      languageNames: { ES: 'Español', EN: 'English', FR: 'Français', ZH: '中文' }
    },
    superCard: {
      title: 'STOP! 📱 Experience AIFA digitally',
      description: 'Open your camera, scan the airport codes, and navigate in real time from your phone.',
      action: 'Scan QR code',
      ariaLabel: 'Open the QR scanner'
    },
    navigation: {
      brand: 'AIFA · Passenger Guide',
      heading: 'How can we help you today?',
      description: 'Choose what you need and we’ll guide you during your visit.',
      quickHelp: 'Quick help',
      unknownQr: 'QR code scanned, but this location is not listed in the guide.',
      roles: {
        arrival: { title: 'I have arrived', subtitle: 'Baggage, immigration, and exit' },
        departure: { title: 'I am travelling', subtitle: 'Check-in, security, and gates' },
        pickup: { title: 'I am picking someone up', subtitle: 'Meeting point and arrivals' },
        tourism: { title: 'Tourism and leisure', subtitle: 'Museums, plaza, and themed restrooms' },
        transport: { title: 'Transportation', subtitle: 'Options for the next leg of your trip' },
        'lost-items': { title: 'Lost property', subtitle: 'Help recovering your belongings' },
        pets: { title: 'Pets', subtitle: 'Get ready to travel with your companion animal' }
      }
    },
    services: {
      tiaTitle: '💡 Need in-person assistance?',
      tiaDescription: 'Anyone wearing an official TIA badge (service providers, security, and support staff) is trained and required to assist and guide you around the airport. Feel free to ask for help!',
      feedback: 'Tell us about your experience'
    },
    scanner: {
      title: 'Scan a location',
      description: 'Point your camera at an AIFA QR code.',
      tagline: 'You can’t control flight times, but you can make the most of your time here. Scan the code to find your way.',
      privacyNotice: 'We use your camera only to scan your boarding pass or a location code. We do not store or transmit any images.',
      allowCamera: 'Allow camera',
      close: 'Close scanner',
      cameraError: 'Camera access failed. Check your browser permissions.',
      scanError: 'This QR code could not be read.'
    }
  },
  FR: {
    welcome: {
      brand: 'AIFA · Guide du passager',
      title: 'Bienvenue à l’AIFA !',
      description: 'Découvrez l’aéroport étape par étape, avec la sérénité et la clarté que vous méritez.',
      start: 'Commencer',
      languageLabel: 'Choisissez votre langue',
      languageNames: { ES: 'Español', EN: 'English', FR: 'Français', ZH: '中文' }
    },
    superCard: {
      title: 'HALTE ! 📱 Découvrez l’AIFA en version numérique',
      description: 'Ouvrez votre appareil photo, scannez les codes de l’aéroport et consultez les informations en temps réel sur votre téléphone.',
      action: 'Scanner le QR code',
      ariaLabel: 'Ouvrir le scanner QR'
    },
    navigation: {
      brand: 'AIFA · Guide du passager',
      heading: 'Comment pouvons-nous vous aider aujourd’hui ?',
      description: 'Choisissez ce dont vous avez besoin et nous vous guiderons pendant votre visite.',
      quickHelp: 'Aide rapide',
      unknownQr: 'Code QR scanné, mais cet emplacement ne figure pas dans le guide.',
      roles: {
        arrival: { title: 'Je viens d’arriver', subtitle: 'Bagages, immigration et sortie' },
        departure: { title: 'Je vais voyager', subtitle: 'Enregistrement, contrôles et portes' },
        pickup: { title: 'Je viens chercher quelqu’un', subtitle: 'Point de rencontre et arrivées' },
        tourism: { title: 'Tourisme et loisirs', subtitle: 'Musées, place et toilettes à thème' },
        transport: { title: 'Transports', subtitle: 'Options pour poursuivre votre trajet' },
        'lost-items': { title: 'Objets trouvés', subtitle: 'Conseils pour récupérer vos affaires' },
        pets: { title: 'Animaux de compagnie', subtitle: 'Préparez le voyage avec votre compagnon' }
      }
    },
    services: {
      tiaTitle: '💡 Besoin d’une aide en personne ?',
      tiaDescription: 'Toute personne portant un badge officiel TIA (prestataires, sécurité et personnel d’assistance) est formée et tenue de vous aider et de vous guider dans l’aéroport. N’hésitez pas à demander de l’aide !',
      feedback: 'Racontez-nous votre expérience'
    },
    scanner: {
      title: 'Scanner un emplacement',
      description: 'Pointez la caméra vers un code QR AIFA.',
      tagline: 'Vous ne maîtrisez pas les horaires des vols, mais vous pouvez profiter de votre temps ici. Scannez le code pour vous orienter.',
      privacyNotice: 'Nous utilisons votre caméra uniquement pour scanner votre carte d’embarquement ou un code d’emplacement. Aucune image n’est enregistrée ni transmise.',
      allowCamera: 'Autoriser la caméra',
      close: 'Fermer le scanner',
      cameraError: 'Impossible d’accéder à la caméra. Vérifiez les autorisations du navigateur.',
      scanError: 'Ce code QR n’a pas pu être lu.'
    }
  },
  ZH: {
    welcome: {
      brand: 'AIFA · 旅客指南',
      title: '欢迎来到 AIFA！',
      description: '我们将为您逐步指引机场之行，让您的旅程更加安心、清晰。',
      start: '开始体验',
      languageLabel: '选择语言',
      languageNames: { ES: 'Español', EN: 'English', FR: 'Français', ZH: '中文' }
    },
    superCard: {
      title: '请注意！📱 体验 AIFA 数字服务',
      description: '打开相机，扫描机场二维码，即可在手机上实时获取指引。',
      action: '扫描二维码',
      ariaLabel: '打开二维码扫描器'
    },
    navigation: {
      brand: 'AIFA · 旅客指南',
      heading: '今天我们能为您提供什么帮助？',
      description: '选择您的需求，我们将为您的机场之行提供指引。',
      quickHelp: '快速帮助',
      unknownQr: '已扫描二维码，但指南中未登记此位置。',
      roles: {
        arrival: { title: '我已抵达', subtitle: '行李、入境与出口' },
        departure: { title: '我要出发', subtitle: '值机、安检与登机口' },
        pickup: { title: '我来接人', subtitle: '会合地点与到达信息' },
        tourism: { title: '观光与休闲', subtitle: '博物馆、广场与主题洗手间' },
        transport: { title: '交通', subtitle: '继续行程的交通选择' },
        'lost-items': { title: '失物招领', subtitle: '寻回遗失物品的指引' },
        pets: { title: '宠物', subtitle: '与您的宠物一起做好出行准备' }
      }
    },
    services: {
      tiaTitle: '💡 需要现场帮助吗？',
      tiaDescription: '佩戴 TIA 官方证件的工作人员（服务人员、安保及协助人员）均受过培训，有责任在机场内为您提供帮助和指引。欢迎随时咨询！',
      feedback: '告诉我们您的体验'
    },
    scanner: {
      title: '扫描位置',
      description: '将摄像头对准 AIFA 二维码。',
      tagline: '您无法控制航班时间，但可以充分利用在这里的时光。扫描二维码获取位置指引。',
      privacyNotice: '我们仅使用摄像头扫描登机牌或位置代码，不会保存或传输任何图像。',
      allowCamera: '允许使用摄像头',
      close: '关闭扫描器',
      cameraError: '无法访问摄像头，请检查浏览器权限。',
      scanError: '无法读取此二维码。'
    }
  }
};
