export const LANGUAGES = ['ES', 'EN', 'FR', 'ZH'] as const;
export type Language = (typeof LANGUAGES)[number];

type RoleTranslation = {
  title: string;
  subtitle: string;
};

type GuideCardTranslation = {
  title: string;
  description: string;
  badges: string[];
  linkLabel?: string;
};

type ModuleTranslation = {
  title: string;
  description: string;
  steps: Record<string, { title: string; description: string; tip?: string }>;
};

export type RouteMapTranslations = {
  title: string;
  description: string;
  selectorLabel: string;
  mexibusLabel: string;
  suburbanLabel: string;
  stationListLabel: string;
  stationDetailsLabel: string;
  frequencyLabel: string;
  travelTimeLabel: string;
  minutesLabel: string;
  faresTitle: string;
  generalFareLabel: string;
  cardFareLabel: string;
  transferTitle: string;
  transferDescription: string;
  estimateNote: string;
  viewAirportMap: string;
  openImageLabel: string;
  closeViewerLabel: string;
  zoomInLabel: string;
  zoomOutLabel: string;
  resetZoomLabel: string;
  gestureHint: string;
  stationDetails: Record<string, string>;
};

export type TransportCategoryId = 'mexibus' | 'suburban' | 'taxis' | 'buses';

export type TransportTranslations = {
  welcomeTitle: string;
  welcomeDescription: string;
  heroCarouselLabel: string;
  carouselRole: string;
  showSlideLabel: string;
  liveMessage: string;
  categoriesTitle: string;
  categoryAction: string;
  detailBack: string;
  itineraryTitle: string;
  recommendationsTitle: string;
  boardingPointLabel: string;
  prepaidCardLabel: string;
  cardFrontLabel: string;
  cardBackLabel: string;
  taxiFareNote: string;
  busFareNote: string;
  taxis: { title: string; summary: string; details: string; imageAlt: string };
  buses: { title: string; summary: string; details: string; imageAlt: string };
  mexibus: { title: string; summary: string; imageAlt: string };
  suburban: { title: string; summary: string; imageAlt: string };
  taxiRecommendations: string[];
  busRecommendations: string[];
};

export type DetailTranslations = {
  backToMenu: string;
  backToOptions: string;
  detectedLocation: string;
  mapLocation: string;
  walkingTime: string;
  services: string;
  attractions: string;
  recommendation: string;
  reference: string;
  accessibility: string;
  photoPoints: string;
  roles: Record<'arrival' | 'departure' | 'pickup' | 'tourism' | 'transport' | 'lost-items' | 'pets', RoleTranslation & { description: string; steps: string[] }>;
  arrival: { title: string; description: string; cards: GuideCardTranslation[]; mapLink: string };
  departure: { title: string; description: string; cards: GuideCardTranslation[] };
  pickup: { title: string; description: string; cards: GuideCardTranslation[] };
  tourism: {
    title: string;
    description: string;
    sections: { title: string; description: string }[];
    culturalAttractions: { title: string; badges: string[] }[];
    commercialAttractions: { title: string; badges: string[] }[];
    localAttractions: {
      title: string;
      description: string;
      directionsLabel: string;
      cards: { title: string; description: string; directions: string }[];
    };
    photoBadges: string[];
    photoLink: string;
  };
  modules: Record<string, ModuleTranslation>;
  routeGallery: { title: string; description: string; steps: { stage: string; title: string; description: string; referencePoint?: string; accessibilityNote?: string }[] };
  routeMap: RouteMapTranslations;
  transport: TransportTranslations;
  timeOfDay: { morning: string; afternoon: string; night: string };
  localTime: string;
  officialSite: string;
  footerDescription: string;
};

type SurveyTranslations = {
  backToOptions: string;
  matters: string;
  heading: string;
  instruction: string;
  categories: { halago: string; queja: string };
  thankYou: string;
  notSubmitted: string;
  immediateHelp: string;
  finish: string;
  options: Record<string, string>;
  responses: Record<'halago' | 'queja', { title: string; message: string; placeholder: string }>;
};

const surveyTranslations: Record<Language, SurveyTranslations> = {
  ES: {
    backToOptions: 'Volver a las opciones', matters: 'Tu experiencia importa', heading: '¿Cómo estuvo tu visita?', instruction: 'Elige la opción que mejor describe lo que viviste.',
    categories: { halago: 'Quiero reconocer algo', queja: 'Quiero compartir algo por mejorar' },
    thankYou: 'Gracias por compartir tu experiencia',
    notSubmitted: 'Tu comentario se mantiene en esta pantalla y no se envía al aeropuerto. Para recibir ayuda inmediata, acércate con confianza al personal TIA.',
    immediateHelp: 'Este directorio no envía reportes; para atención inmediata, acércate al personal TIA.',
    finish: 'Finalizar',
    options: {
      h1: 'El baño que usé estaba impecable y temático', h2: 'Un colaborador con TIA me acompañó amablemente', h3: 'Pasé el filtro de seguridad rapidísimo', h4: 'La señalización para mi sala fue muy clara', h5: 'La app me ahorró tiempo y confusión', h6: 'La zona comercial y restaurantes superaron mis expectativas', h7: 'El acceso al Mexibús / Transporte fue muy fácil', h8: 'Excelente atención para personas de la tercera edad / movilidad', h9: 'Disfruté mucho el recorrido por los museos / zonas culturales', h10: 'Mi experiencia general en el AIFA fue excelente',
      q1: 'Encontré un elevador, escalera o máquina fuera de servicio', q2: 'Un baño necesitaba limpieza o insumos (papel/jabón)', q3: 'Un prestador de servicio / personal TIA no me atendió bien', q4: 'Me costó trabajo encontrar mi puerta de abordaje / ubicación', q5: 'El filtro de seguridad / migración demoró demasiado', q6: 'Tuve contratiempos en la banda de reclamación de equipaje', q7: 'Tuve problemas de conexión a internet / Wi-Fi', q8: 'La fila o información del transporte / taxi fue confusa', q9: 'Falta de claridad en los precios de locales o servicios', q10: 'Tengo una sugerencia para mejorar la aplicación o la terminal'
    },
    responses: {
      halago: { title: '¡Nos alegra muchísimo leer esto! 🎉', message: 'Tu reconocimiento nos motiva a mantener la excelencia en la experiencia de cada pasajero. Transmitiremos tus felicitaciones al equipo correspondiente.', placeholder: 'Si quieres agregar un mensaje especial o mencionar a alguien, escríbelo aquí (opcional):' },
      queja: { title: 'Te escuchamos y ya estamos trabajando en ello 🤝', message: 'Lamentamos mucho los inconvenientes. Tu reporte genera una alerta para que el personal operativo revise esta situación a la brevedad.', placeholder: 'Danos más detalles (ej. número de baño, área o número de gafete TIA) si lo deseas:' }
    }
  },
  EN: {
    backToOptions: 'Back to options', matters: 'Your experience matters', heading: 'How was your visit?', instruction: 'Choose the option that best describes your experience.',
    categories: { halago: 'I would like to recognize something', queja: 'I would like to suggest an improvement' },
    thankYou: 'Thank you for sharing your experience',
    notSubmitted: 'Your comment stays on this screen and is not sent to the airport. For immediate assistance, feel free to approach TIA staff.',
    immediateHelp: 'This directory does not send reports. For immediate assistance, please approach TIA staff.',
    finish: 'Finish',
    options: {
      h1: 'The restroom I used was spotless and themed', h2: 'A TIA staff member kindly assisted me', h3: 'I passed through security very quickly', h4: 'The signs to my gate were very clear', h5: 'The app saved me time and confusion', h6: 'The shopping area and restaurants exceeded my expectations', h7: 'Access to Mexibús / transportation was very easy', h8: 'Excellent assistance for older passengers / passengers with reduced mobility', h9: 'I really enjoyed the museums / cultural areas', h10: 'My overall experience at AIFA was excellent',
      q1: 'I found an out-of-service elevator, escalator, or machine', q2: 'A restroom needed cleaning or supplies (paper / soap)', q3: 'A service provider / TIA staff member did not assist me well', q4: 'I had trouble finding my gate / location', q5: 'Security / immigration took too long', q6: 'I had an issue at the baggage claim belt', q7: 'I had internet / Wi-Fi connection problems', q8: 'The transportation / taxi queue or information was confusing', q9: 'Prices at shops or for services were unclear', q10: 'I have a suggestion to improve the app or terminal'
    },
    responses: {
      halago: { title: 'We are delighted to hear this! 🎉', message: 'Your recognition motivates us to maintain an excellent experience for every passenger. We will share your praise with the relevant team.', placeholder: 'Add a special message or mention someone here (optional):' },
      queja: { title: 'We hear you and are working on it 🤝', message: 'We are sorry for the inconvenience. Your report alerts the operations team so they can review the situation as soon as possible.', placeholder: 'Add details if you wish (e.g. restroom number, area, or TIA badge number):' }
    }
  },
  FR: {
    backToOptions: 'Retour aux options', matters: 'Votre expérience compte', heading: 'Comment s’est passée votre visite ?', instruction: 'Choisissez l’option qui décrit le mieux votre expérience.',
    categories: { halago: 'Je souhaite souligner un point positif', queja: 'Je souhaite proposer une amélioration' },
    thankYou: 'Merci d’avoir partagé votre expérience',
    notSubmitted: 'Votre commentaire reste sur cet écran et n’est pas transmis à l’aéroport. Pour une aide immédiate, adressez-vous au personnel TIA.',
    immediateHelp: 'Ce répertoire n’envoie pas de signalements. Pour une aide immédiate, adressez-vous au personnel TIA.',
    finish: 'Terminer',
    options: {
      h1: 'Les toilettes utilisées étaient impeccables et décorées', h2: 'Un membre du personnel TIA m’a gentiment accompagné', h3: 'J’ai passé le contrôle de sécurité très rapidement', h4: 'La signalisation vers ma porte était très claire', h5: 'L’application m’a fait gagner du temps et évité toute confusion', h6: 'Les commerces et restaurants ont dépassé mes attentes', h7: 'L’accès au Mexibús / aux transports était très facile', h8: 'Excellent accueil des personnes âgées / à mobilité réduite', h9: 'J’ai beaucoup apprécié les musées / espaces culturels', h10: 'Mon expérience générale à l’AIFA a été excellente',
      q1: 'Un ascenseur, escalier mécanique ou appareil était hors service', q2: 'Des toilettes nécessitaient un nettoyage ou des fournitures', q3: 'Un prestataire / membre du personnel TIA ne m’a pas bien aidé', q4: 'J’ai eu du mal à trouver ma porte / mon emplacement', q5: 'Le contrôle de sécurité / l’immigration a pris trop de temps', q6: 'J’ai rencontré un problème au tapis à bagages', q7: 'J’ai eu des problèmes de connexion Internet / Wi-Fi', q8: 'La file ou les informations sur les transports / taxis étaient confuses', q9: 'Les prix des commerces ou services manquaient de clarté', q10: 'J’ai une suggestion pour améliorer l’application ou le terminal'
    },
    responses: {
      halago: { title: 'Nous sommes ravis de vous lire ! 🎉', message: 'Votre appréciation nous encourage à offrir une excellente expérience à chaque passager. Nous transmettrons vos félicitations à l’équipe concernée.', placeholder: 'Ajoutez un message ou mentionnez quelqu’un (facultatif) :' },
      queja: { title: 'Nous vous avons entendu et agissons 🤝', message: 'Nous sommes désolés pour ce désagrément. Votre signalement alerte l’équipe opérationnelle afin qu’elle examine rapidement la situation.', placeholder: 'Ajoutez des détails si vous le souhaitez (numéro des toilettes, zone ou badge TIA) :' }
    }
  },
  ZH: {
    backToOptions: '返回选项', matters: '您的体验很重要', heading: '您的旅程体验如何？', instruction: '请选择最符合您体验的选项。',
    categories: { halago: '我想表扬一件事', queja: '我想提出改进建议' },
    thankYou: '感谢您分享体验',
    notSubmitted: '您的评论仅显示在此页面，不会发送给机场。如需立即帮助，请联系 TIA 工作人员。',
    immediateHelp: '此目录不会发送报告。如需立即帮助，请联系 TIA 工作人员。',
    finish: '完成',
    options: {
      h1: '我使用的洗手间干净整洁且主题独特', h2: 'TIA 工作人员友好地陪伴并帮助了我', h3: '我很快通过了安全检查', h4: '前往候机区的指示非常清晰', h5: '应用为我节省了时间并减少了困惑', h6: '商业区和餐厅超出了我的预期', h7: '前往 Mexibús / 交通区域非常方便', h8: '为老年人 / 行动不便旅客提供了优质服务', h9: '我很喜欢博物馆 / 文化区域之旅', h10: '我在 AIFA 的整体体验非常棒',
      q1: '我发现电梯、自动扶梯或设备无法使用', q2: '洗手间需要清洁或补充用品（纸巾 / 肥皂）', q3: '服务人员 / TIA 工作人员未能妥善帮助我', q4: '我很难找到登机口 / 目的地', q5: '安全检查 / 入境检查耗时太久', q6: '我在行李转盘遇到了问题', q7: '互联网 / Wi-Fi 连接有问题', q8: '交通 / 出租车排队或信息不清楚', q9: '商店或服务的价格不够清晰', q10: '我有改进应用或航站楼的建议'
    },
    responses: {
      halago: { title: '很高兴收到您的认可！🎉', message: '您的认可激励我们持续提升每位旅客的体验。我们会将您的表扬转达给相关团队。', placeholder: '您可以在此添加特别留言或提及工作人员（选填）：' },
      queja: { title: '我们已收到并正在处理 🤝', message: '对于给您带来的不便，我们深表歉意。您的反馈会提醒运营团队尽快查看并处理。', placeholder: '如愿意，请提供更多信息（如洗手间编号、区域或 TIA 证件编号）：' }
    }
  }
};

export type VideoCallTranslations = {
  button: string;
  title: string;
  privacy: string;
  requestingPermissions: string;
  calling: string;
  connected: string;
  waiting: string;
  localVideoLabel: string;
  remoteVideoLabel: string;
  endCall: string;
  permissionError: string;
  connectionError: string;
  ratingTitle: string;
  ratingPrompt: string;
  commentLabel: string;
  commentPlaceholder: string;
  submitRating: string;
  close: string;
  ratingRequired: string;
  thanks: string;
  managerTitle: string;
  managerDescription: string;
  managerOnline: string;
  managerOffline: string;
  activateAlerts: string;
  waitingForCalls: string;
  incomingCall: string;
  acceptCall: string;
  finishCall: string;
  callHistory: string;
  noCallHistory: string;
  durationLabel: string;
  dateLabel: string;
  managementIdLabel: string;
  ratingLabel: string;
  soundAlert: string;
  peerIdError: string;
};

type FlightTimeTranslations = {
  mode: string;
  title: string;
  description: string;
  travelPrompt: string;
  travelDescription: string;
  openForm: string;
  closeForm: string;
  date: string;
  selectDate: string;
  referenceTime: string;
  boardingClose: string;
  gate: string;
  selectGate: string;
  selectGateOption: string;
  calculate: string;
  errors: { flightDate: string; boardingTime: string; gate: string };
  result: {
    at: string;
    destination: string;
    selectedGate: string;
    walking: string;
    available: string;
    noData: string;
    minutes: string;
    route: string;
    estimate: string;
    statuses: Record<'verde' | 'amarillo' | 'rojo' | 'error', string>;
    traffic: Record<'verde' | 'amarillo' | 'rojo' | 'error', string>;
  };
};

type PodotactileTranslations = {
  title: string;
  description: string;
  startCamera: string;
  stopCamera: string;
  permissionHint: string;
  cameraError: string;
  unsupported: string;
  transitionStart: string;
  transitionFinish: string;
  transitionStatus: string;
  searching: string;
  detected: string;
  lost: string;
  detectionPaused: string;
  noDetection: string;
  step: string;
  previous: string;
  next: string;
  routeDetected: string;
  routeLost: string;
  visualAid: string;
  cameraActive: string;
  permissionRequired: string;
};

const podotactileTranslations: Record<Language, PodotactileTranslations> = {
  ES: {
    title: 'Guía de piso',
    description: 'Apunta la cámara hacia el recorrido podotáctil. La superposición visual es orientativa y puede fallar; confirma siempre la ruta con la señalización y el entorno.',
    startCamera: 'Activar cámara',
    stopCamera: 'Apagar cámara',
    permissionHint: 'La cámara solo se activa cuando pulsas el botón. Se procesa el video en este dispositivo y no se guarda.',
    cameraError: 'No se pudo iniciar la cámara. Revisa los permisos del navegador y vuelve a intentarlo.',
    unsupported: 'Este navegador no permite acceder a la cámara. Abre la guía en un navegador compatible y mediante HTTPS.',
    transitionStart: 'Iniciar transición en escaleras',
    transitionFinish: 'Terminé las escaleras; reanudar detección',
    transitionStatus: 'Transición en escaleras',
    searching: 'Buscando ruta podotáctil',
    detected: 'Ruta podotáctil detectada',
    lost: 'Ruta no detectada',
    detectionPaused: 'Detección pausada durante la transición',
    noDetection: 'No se distingue una ruta con suficiente confianza. Revisa el entorno y continúa con precaución.',
    step: 'Paso',
    previous: 'Paso anterior',
    next: 'Siguiente paso',
    routeDetected: 'La cámara detectó un posible recorrido.',
    routeLost: 'Se perdió la detección visual del recorrido.',
    visualAid: 'Ayuda visual experimental; no sustituye la guía táctil, la señalización ni la asistencia personal.',
    cameraActive: 'Cámara activa',
    permissionRequired: 'Pulsa “Activar cámara” y concede permiso para comenzar.'
  },
  EN: {
    title: 'Floor guide',
    description: 'Point the camera toward the tactile route. The visual overlay is advisory and may be inaccurate; always confirm your way using signs and your surroundings.',
    startCamera: 'Turn on camera',
    stopCamera: 'Turn off camera',
    permissionHint: 'The camera starts only when you press the button. Video is processed on this device and is not saved.',
    cameraError: 'The camera could not be started. Check browser permissions and try again.',
    unsupported: 'This browser cannot access the camera. Open the guide in a compatible browser over HTTPS.',
    transitionStart: 'Start stair transition',
    transitionFinish: 'Stairs complete; resume detection',
    transitionStatus: 'Stair transition',
    searching: 'Searching for tactile route',
    detected: 'Tactile route detected',
    lost: 'Route not detected',
    detectionPaused: 'Detection paused during transition',
    noDetection: 'No route is visible with sufficient confidence. Check your surroundings and proceed carefully.',
    step: 'Step',
    previous: 'Previous step',
    next: 'Next step',
    routeDetected: 'The camera detected a possible route.',
    routeLost: 'Visual route detection was lost.',
    visualAid: 'Experimental visual aid; it does not replace tactile guidance, signage, or personal assistance.',
    cameraActive: 'Camera active',
    permissionRequired: 'Press “Turn on camera” and grant permission to begin.'
  },
  FR: {
    title: 'Guide au sol',
    description: 'Dirigez la caméra vers le parcours podotactile. Le repère visuel est indicatif et peut être imprécis ; vérifiez toujours votre itinéraire avec la signalisation et votre environnement.',
    startCamera: 'Activer la caméra',
    stopCamera: 'Désactiver la caméra',
    permissionHint: 'La caméra ne démarre que lorsque vous appuyez sur le bouton. La vidéo est traitée sur cet appareil et n’est pas enregistrée.',
    cameraError: 'Impossible de démarrer la caméra. Vérifiez les autorisations du navigateur et réessayez.',
    unsupported: 'Ce navigateur ne permet pas d’accéder à la caméra. Ouvrez le guide dans un navigateur compatible via HTTPS.',
    transitionStart: 'Commencer la transition dans les escaliers',
    transitionFinish: 'Escaliers terminés ; reprendre la détection',
    transitionStatus: 'Transition dans les escaliers',
    searching: 'Recherche du parcours podotactile',
    detected: 'Parcours podotactile détecté',
    lost: 'Parcours non détecté',
    detectionPaused: 'Détection en pause pendant la transition',
    noDetection: 'Aucun parcours suffisamment identifiable. Vérifiez votre environnement et avancez prudemment.',
    step: 'Étape',
    previous: 'Étape précédente',
    next: 'Étape suivante',
    routeDetected: 'La caméra a détecté un parcours possible.',
    routeLost: 'La détection visuelle du parcours a été perdue.',
    visualAid: 'Aide visuelle expérimentale ; elle ne remplace pas le guidage tactile, la signalisation ou une aide humaine.',
    cameraActive: 'Caméra active',
    permissionRequired: 'Appuyez sur « Activer la caméra » et autorisez l’accès pour commencer.'
  },
  ZH: {
    title: '地面指引',
    description: '将摄像头对准触觉引导路线。视觉叠加仅供参考，可能不准确；请始终结合标志和周围环境确认路线。',
    startCamera: '开启摄像头',
    stopCamera: '关闭摄像头',
    permissionHint: '只有点击按钮后才会开启摄像头。视频仅在本设备处理，不会保存。',
    cameraError: '无法启动摄像头。请检查浏览器权限后重试。',
    unsupported: '此浏览器无法访问摄像头。请通过 HTTPS 使用兼容的浏览器打开指南。',
    transitionStart: '开始扶梯过渡',
    transitionFinish: '已通过扶梯；恢复检测',
    transitionStatus: '扶梯过渡',
    searching: '正在查找触觉引导路线',
    detected: '已检测到触觉引导路线',
    lost: '未检测到路线',
    detectionPaused: '过渡期间已暂停检测',
    noDetection: '未能以足够置信度识别路线。请观察周围环境并谨慎前行。',
    step: '步骤',
    previous: '上一步',
    next: '下一步',
    routeDetected: '摄像头检测到可能的路线。',
    routeLost: '路线的视觉检测已中断。',
    visualAid: '实验性视觉辅助，不能替代触觉引导、标志或人工协助。',
    cameraActive: '摄像头已开启',
    permissionRequired: '点击“开启摄像头”并授予权限后开始。'
  }
};

const flightTimeTranslations: Record<Language, FlightTimeTranslations> = {
  ES: {
    mode: 'Modo Serenidad', title: '¿Me da tiempo para mi vuelo?', description: 'Calcula tu margen real desde tu ubicación actual hasta la puerta de abordaje.',
    travelPrompt: 'Voy a viajar', travelDescription: 'Indica tu vuelo para recibir una orientación personalizada.', openForm: 'Abrir formulario', closeForm: 'Cerrar',
    date: 'Fecha del vuelo', selectDate: 'Selecciona el día de tu vuelo.', referenceTime: 'Hora de referencia', boardingClose: 'Abordaje o cierre de la puerta.', gate: 'Puerta de abordaje', selectGate: 'Selecciona la puerta que aparece en tu pase de abordar.', selectGateOption: 'Selecciona una puerta', calculate: 'Calcular mi tiempo',
    errors: { flightDate: 'Selecciona una fecha válida y futura para tu vuelo.', boardingTime: 'Indica una hora futura de abordaje o cierre de puerta.', gate: 'Selecciona una puerta de abordaje.' },
    result: {
      at: 'Estás en', destination: 'y tu destino es', selectedGate: 'la puerta seleccionada', walking: 'Caminata estimada', available: 'Tiempo disponible', noData: 'No disponible', minutes: 'min', route: 'Ruta configurada:',
      estimate: 'Es una estimación. Puede variar por documentación, filas de seguridad, señalización, ascensores, escaleras y condiciones operativas del aeropuerto.',
      statuses: { verde: 'Según la estimación, tienes un margen de tiempo disponible para llegar a tu puerta.', amarillo: 'Tu margen de tiempo es limitado. Prioriza tu recorrido hacia la puerta de abordaje.', rojo: 'El tiempo estimado puede ser insuficiente. Dirígete directamente a tu puerta y considera los procesos pendientes.', error: 'El horario seleccionado ya pasó. Selecciona una fecha y hora futuras.' },
      traffic: { verde: 'Verde', amarillo: 'Amarillo', rojo: 'Rojo', error: 'Error' }
    }
  },
  EN: {
    mode: 'Calm Mode', title: 'Will I make my flight?', description: 'Estimate your travel time from your current location to the boarding gate.',
    travelPrompt: 'I am travelling', travelDescription: 'Enter your flight details for personalized guidance.', openForm: 'Open form', closeForm: 'Close',
    date: 'Flight date', selectDate: 'Select your flight date.', referenceTime: 'Reference time', boardingClose: 'Boarding time or gate closing time.', gate: 'Boarding gate', selectGate: 'Select the gate shown on your boarding pass.', selectGateOption: 'Select a gate', calculate: 'Calculate my time',
    errors: { flightDate: 'Select a valid future date for your flight.', boardingTime: 'Enter a future boarding or gate closing time.', gate: 'Select a boarding gate.' },
    result: {
      at: 'You are at', destination: 'and your destination is', selectedGate: 'the selected gate', walking: 'Estimated walk', available: 'Time available', noData: 'Unavailable', minutes: 'min', route: 'Configured route:',
      estimate: 'This is an estimate. It may vary depending on check-in, security queues, signage, elevators, stairs, and airport operating conditions.',
      statuses: { verde: 'Based on this estimate, you have time available to reach your gate.', amarillo: 'Your time is limited. Prioritize your route to the boarding gate.', rojo: 'You may not have enough time. Go directly to your gate and consider any remaining procedures.', error: 'The selected time has passed. Choose a future date and time.' },
      traffic: { verde: 'Green', amarillo: 'Yellow', rojo: 'Red', error: 'Error' }
    }
  },
  FR: {
    mode: 'Mode sérénité', title: 'Ai-je le temps pour mon vol ?', description: 'Estimez votre temps de trajet entre votre emplacement actuel et la porte d’embarquement.',
    travelPrompt: 'Je vais voyager', travelDescription: 'Indiquez votre vol pour obtenir des conseils personnalisés.', openForm: 'Ouvrir le formulaire', closeForm: 'Fermer',
    date: 'Date du vol', selectDate: 'Sélectionnez la date de votre vol.', referenceTime: 'Heure de référence', boardingClose: 'Embarquement ou fermeture de la porte.', gate: 'Porte d’embarquement', selectGate: 'Sélectionnez la porte indiquée sur votre carte d’embarquement.', selectGateOption: 'Sélectionnez une porte', calculate: 'Calculer mon temps',
    errors: { flightDate: 'Sélectionnez une date de vol valide et future.', boardingTime: 'Indiquez une heure future d’embarquement ou de fermeture de la porte.', gate: 'Sélectionnez une porte d’embarquement.' },
    result: {
      at: 'Vous êtes à', destination: 'et votre destination est', selectedGate: 'la porte sélectionnée', walking: 'Marche estimée', available: 'Temps disponible', noData: 'Indisponible', minutes: 'min', route: 'Itinéraire prévu :',
      estimate: 'Il s’agit d’une estimation. Elle peut varier selon l’enregistrement, les files de sécurité, la signalisation, les ascenseurs, les escaliers et les conditions d’exploitation de l’aéroport.',
      statuses: { verde: 'Selon cette estimation, vous avez le temps nécessaire pour rejoindre votre porte.', amarillo: 'Votre marge est limitée. Priorisez le trajet vers la porte d’embarquement.', rojo: 'Le temps disponible pourrait être insuffisant. Rendez-vous directement à votre porte.', error: 'L’heure sélectionnée est passée. Choisissez une date et une heure futures.' },
      traffic: { verde: 'Vert', amarillo: 'Jaune', rojo: 'Rouge', error: 'Erreur' }
    }
  },
  ZH: {
    mode: '安心模式', title: '时间够赶上航班吗？', description: '估算从当前位置到登机口所需的时间。',
    travelPrompt: '我要出发', travelDescription: '填写航班信息以获取个性化指引。', openForm: '打开表单', closeForm: '关闭',
    date: '航班日期', selectDate: '请选择航班日期。', referenceTime: '参考时间', boardingClose: '登机时间或登机口关闭时间。', gate: '登机口', selectGate: '请选择登机牌上显示的登机口。', selectGateOption: '选择登机口', calculate: '计算所需时间',
    errors: { flightDate: '请选择有效的未来航班日期。', boardingTime: '请输入未来的登机或登机口关闭时间。', gate: '请选择登机口。' },
    result: {
      at: '您当前位于', destination: '，目的地是', selectedGate: '所选登机口', walking: '预计步行时间', available: '剩余时间', noData: '不可用', minutes: '分钟', route: '规划路线：',
      estimate: '此结果为估算值，可能受值机、安全检查排队、指示牌、电梯、楼梯及机场运营情况影响。',
      statuses: { verde: '根据估算，您有充足时间前往登机口。', amarillo: '剩余时间有限，请优先前往登机口。', rojo: '预计时间可能不足，请直接前往登机口并留意后续流程。', error: '所选时间已过，请选择未来的日期和时间。' },
      traffic: { verde: '绿色', amarillo: '黄色', rojo: '红色', error: '错误' }
    }
  }
};

const detailTranslations: Record<Language, DetailTranslations> = {
  ES: {
    backToMenu: 'Volver al Menú Principal',
    backToOptions: 'Volver a las opciones',
    detectedLocation: 'Ubicación detectada',
    mapLocation: 'Ver mapa de ubicación →',
    walkingTime: 'a pie',
    services: 'Servicios',
    attractions: 'Atractivos',
    recommendation: 'Recomendación:',
    reference: 'Referencia:',
    accessibility: 'Accesibilidad:',
    photoPoints: 'Puntos fotográficos',
    roles: {
      arrival: { title: 'Llegué en un vuelo', subtitle: 'Equipaje, migración y salida', description: 'Te ayudamos a orientarte al llegar y a encontrar el siguiente paso de tu recorrido.', steps: ['Sigue la señalización hacia equipaje y llegadas.', 'Localiza servicios y transporte en la terminal.', 'Confirma tu punto de salida antes de continuar.'] },
      departure: { title: 'Voy a viajar', subtitle: 'Check-in, filtros y salas', description: 'Organiza tu salida con tiempo y ubica los puntos principales antes de abordar.', steps: ['Consulta con tu aerolínea el mostrador de documentación.', 'Ten a la mano tus documentos para pasar los filtros.', 'Revisa las pantallas para confirmar tu sala y puerta.'] },
      pickup: { title: 'Vengo por alguien', subtitle: 'Punto de encuentro y llegadas', description: 'Coordina un encuentro sencillo en la zona de llegadas y mantente atento a los avisos de vuelo.', steps: ['Confirma la terminal y el horario de llegada.', 'Acuerda un punto de encuentro fácil de reconocer.', 'Sigue la señalización hacia el área pública de llegadas.'] },
      tourism: { title: 'Paseo y Turismo', subtitle: 'Museos, plaza y baños temáticos', description: 'Explora los espacios culturales y comerciales del aeropuerto durante tu visita.', steps: ['Visita el Museo del Mamut y sus espacios culturales.', 'Recorre la Plaza Mexicana y consulta sus servicios.', 'Sigue los señalamientos para ubicar los baños temáticos.'] },
      transport: { title: 'Transporte', subtitle: 'Opciones para continuar tu trayecto', description: 'Ubica las conexiones terrestres disponibles y confirma horarios y puntos de abordaje.', steps: ['Sigue la señalización oficial hacia transporte.', 'Confirma horarios, tarifas y disponibilidad con el operador.', 'Conserva tus pertenencias durante el traslado.'] },
      'lost-items': { title: 'Objetos olvidados', subtitle: 'Orientación para recuperar tus pertenencias', description: 'Si olvidaste algo, reporta el objeto con la mayor cantidad de detalles posible.', steps: ['Anota dónde y cuándo viste el objeto por última vez.', 'Describe el objeto y cualquier dato que permita identificarlo.', 'Solicita orientación al personal del aeropuerto o de tu aerolínea.'] },
      pets: { title: 'Mascotas', subtitle: 'Viaja preparado con tu animal de compañía', description: 'Consulta con anticipación las reglas de tu aerolínea y los servicios disponibles en terminal.', steps: ['Confirma requisitos y transportadora directamente con tu aerolínea.', 'Lleva contigo la documentación veterinaria requerida.', 'Mantén a tu mascota bajo supervisión en las áreas permitidas.'] }
    },
    arrival: {
      title: 'Llegué en un vuelo',
      description: 'Equipaje, migración y salida: encuentra lo que necesitas para continuar tu recorrido por el AIFA.',
      cards: [
        { title: '1. Reclamo de Equipaje y Control', description: 'Dirígete a las bandas de reclamo de equipaje. Si llegas en un vuelo internacional, pasa por el filtro de Migración e INM.', badges: ['Bandas 1-6', 'Migración INM', 'Aduana'] },
        { title: '2. Servicios Esenciales en la Terminal', description: 'Encuentra cajeros automáticos, casas de cambio, sanitarios temáticos, atención médica y módulos de información a la salida.', badges: ['Cajeros ATM', 'Sanitarios', 'Info Turística'] },
        { title: '3. Transporte y Salida del AIFA', description: 'Conecta directamente con la estación del Mexibús (Línea 1), taxis autorizados, autobuses foráneos o el área de estacionamiento.', badges: ['Mexibús Línea 1', 'Taxis Autorizados', 'Autobuses Foráneos', 'Estacionamiento'] }
      ],
      mapLink: 'Ver mapa de ubicación →'
    },
    departure: {
      title: 'Voy a viajar',
      description: 'Check-in, filtros y salas: prepara tu salida y ubica cada etapa antes de abordar.',
      cards: [
        { title: '1. Check-in y Documentación', description: 'Ubica los mostradores de tu aerolínea o usa los kioscos digitales para imprimir tu pase de abordar y documentar equipaje de bodega.', badges: ['Mostradores A-F', 'Kioscos Digitales', 'Equipaje'], linkLabel: 'Ver mapa de mostradores →' },
        { title: '2. Filtros de Seguridad e Inspección', description: 'Ten a la mano tu pase de abordar e identificación oficial para ingresar a la zona de salas de última espera.', badges: ['Pase de Abordar', 'Identificación Oficial', 'Filtro Central'], linkLabel: 'Ver requisitos de acceso →' },
        { title: '3. Salas de Ultramar y Abordaje', description: 'Revisa las pantallas de vuelos para confirmar tu sala y puerta de abordaje. Disfruta de tiendas, servicios y áreas de descanso.', badges: ['Puertas A1-A12', 'Pantallas de Vuelos', 'Área Comercial'], linkLabel: 'Ubicar mi puerta →' }
      ]
    },
    pickup: {
      title: 'Vengo por alguien',
      description: 'Puntos de encuentro, estacionamiento y servicios para esperar con comodidad la llegada de tu pasajero.',
      cards: [
        { title: '1. Puntos de Encuentro y Espera', description: 'Ubica las áreas de llegadas nacionales e internacionales. Revisa las pantallas de vuelos en tiempo real para conocer el estatus de llegada.', badges: ['Llegadas Nacionales', 'Llegadas Internacionales', 'Pantallas de Vuelo'], linkLabel: 'Ver mapa de puntos de encuentro →' },
        { title: '2. Estacionamiento y Tiempo', description: 'Accede al estacionamiento principal o utiliza la zona de espera corta para coordinar el momento exacto en que tu pasajero salga de la terminal.', badges: ['Estacionamiento Principal', 'Pago Digital / Tarjeta', 'Zona de Carga'], linkLabel: 'Tarifas y ubicación de estacionamiento →' },
        { title: '3. Servicios de Espera Confortable', description: 'Encuentra áreas de descanso, cafeterías, tiendas de conveniencia y sanitarios mientras esperas la llegada de tu vuelo.', badges: ['Cafeterías', 'Sanitarios Temáticos', 'WiFi Gratuito'], linkLabel: 'Ver amenidades de espera →' }
      ]
    },
    tourism: {
      title: 'Paseo y Turismo',
      description: 'Explora los museos, experiencias comerciales y espacios fotográficos del AIFA.',
      localAttractions: {
        title: 'Entorno Local · Tecámac Centro',
        description: 'Descubre espacios naturales, históricos y culturales cerca del AIFA.',
        directionsLabel: 'Cómo llegar desde Mexibús Línea 1',
        cards: [
          {
            title: 'Parque Sierra Hermosa',
            description: 'Un espacio natural y recreativo emblemático de Tecámac.',
            directions: 'Desde la estación Terminal de Pasajeros del AIFA, aborda Mexibús Línea 1 hacia Ojo de Agua. En Ojo de Agua, conecta con taxi o transporte local hacia el parque; confirma el punto de descenso con el operador.'
          },
          {
            title: 'Tecámac Centro & Plaza Principal',
            description: 'Recorre el centro histórico y su plaza principal.',
            directions: 'Desde Terminal de Pasajeros, viaja en Línea 1 dirección Ojo de Agua y baja en Ojo de Agua. Continúa en transporte local o taxi hacia el Centro de Tecámac y la Plaza Principal; la plaza no cuenta con estación de Mexibús.'
          },
          {
            title: 'Corredor Cultural AIFA',
            description: 'Museos, aviación y patrimonio histórico en el entorno del AIFA.',
            directions: 'Baja en Terminal de Pasajeros del AIFA. Desde ahí sigue los señalamientos hacia el corredor cultural dentro del complejo; confirma horarios y acceso público de cada recinto antes de ir.'
          }
        ]
      },
      sections: [
        { title: '1. Corredor Cultural y Museos', description: 'Descubre los espacios culturales únicos integrados dentro del área aeroportuaria.' },
        { title: '2. Experiencia Comercial y Baños Temáticos', description: 'Recorre los atractivos de la cultura popular mexicana dentro del terminal.' },
        { title: '3. Miradores y Zonas Fotográficas', description: 'Encuentra las mejores ubicaciones para fotos de recuerdo con la torre de control y las letras monumentales.' }
      ],
      culturalAttractions: [
        { title: 'Museo del Mamut (Quinametzin)', badges: ['Fósiles', 'Tierra de Gigantes'] },
        { title: 'Museo de la Aviación Militar (MAM)', badges: ['Aeronaves', 'Fuerza Aérea'] },
        { title: 'Tren Presidencial Olivo', badges: ['Vagón Histórico', 'Historia'] }
      ],
      commercialAttractions: [
        { title: 'Baños Temáticos', badges: ['Lucha Libre', 'Cine Mexicano', 'Chespirito'] },
        { title: 'Plaza Comercial Mexica', badges: ['Artesanías', 'Souvenirs', 'Gastronomía'] }
      ],
      photoBadges: ['Letras AIFA', 'Mirador Principal', 'Zonas Verdes'],
      photoLink: 'Ver mapa de puntos fotográficos →'
    },
    timeOfDay: { morning: 'Buenos días', afternoon: 'Buenas tardes', night: 'Buenas noches' },
    localTime: 'Hora local',
    officialSite: 'Sitio Oficial AIFA',
    footerDescription: 'Aeropuerto Internacional Felipe Ángeles — Guiando tu camino paso a paso.',
    modules: {
      museos: {
        title: 'Corredor Cultural y Museos', description: 'Atractivos culturales dentro de la Base Aérea y zona aeroportuaria.',
        steps: {
          'tur-1': { title: 'Museo Paleontológico Quinamávida (Tierra de Gigantes)', description: 'Ubicado a unos minutos de la terminal. Exhibe restos de mamuts y megafauna descubiertos durante la construcción.', tip: '¡No necesitas pase de abordar para entrar! La entrada es gratuita y abierta a todo público.' },
          'tur-2': { title: 'Museo de la Aviación Militar (MAM)', description: 'Colección histórica de aeronaves de la Fuerza Aérea Mexicana en exhibición interactiva.', tip: 'Cuenta con un hangar real e interactivo ideal para ir en familia antes o después de esperar un vuelo.' },
          'tur-3': { title: 'Tren Histórico Olivo', description: 'Vagón presidencial histórico restaurado dentro del complejo militar.' }
        }
      },
      'banos-tematicos': {
        title: 'Ruta de Baños Temáticos', description: 'Experiencia visual única en los sanitarios públicos del aeropuerto.',
        steps: {
          'tur-4': { title: 'Sanitarios de Lucha Libre y Cine Mexicano', description: 'Murales y decoración dedicados a la cultura popular mexicana ubicados en pasillos principales.', tip: 'Hay más de 30 baños temáticos con diseños diferentes (Catrinas, El Chavo, Mariachi, Maya, etc.).' }
        }
      },
      mexibus: {
        title: 'Mexibús (Línea 1)', description: 'Conexión directa con Ojo de Agua y Ciudad Azteca.',
        steps: {
          'trans-1': { title: 'Llegada a la Terminal Mexibús AIFA', description: 'Se ubica en la planta baja / nivel inferior de la terminal de pasajeros.', tip: 'El pago se realiza mediante la tarjeta Mexipase. Puedes adquirirla y recargarla en las máquinas del acceso.' },
          'trans-2': { title: 'Abordaje y Recorrido', description: 'Las unidades salen con frecuencia regular hacia las estaciones de interconexión con el Estado de México y CDMX.' }
        }
      },
      'taxis-autobuses': {
        title: 'Taxis Autorizados y Autobuses Foráneos', description: 'Opciones de movilidad terrestre hacia CDMX y estados vecinos.',
        steps: {
          'trans-3': { title: 'Taquillas de Taxis Autorizados', description: 'Ubicadas en el área pública de llegadas. Paga únicamente en los módulos oficiales antes de abordar.', tip: 'Nunca abordes un taxi fuera de la zona autorizada o sin boleto pagado previamente en taquilla por tu seguridad.' },
          'trans-4': { title: 'Terminal de Autobuses (Foráneos)', description: 'Conexiones directas a Puebla, Querétaro, Pachuca, Toluca y terminales de CDMX (TAPO, Norte, Sur).' }
        }
      }
    },
    transport: {
      welcomeTitle: '¿Buscas un medio de transporte para llegar a tu destino?',
      welcomeDescription: 'El Aeropuerto Internacional Felipe Ángeles cuenta con los siguientes medios de transporte de primer nivel para que puedas llegar a tu destino a tiempo y moverte cómodamente. En esta sección vas a encontrar los medios de transporte y sus rutas muy bien definidos para que no te pierdas y disfrutes tu estancia. ¡Bienvenido!',
      heroCarouselLabel: 'Carrusel de medios de transporte',
      carouselRole: 'carrusel',
      showSlideLabel: 'Mostrar imagen',
      liveMessage: 'A esta hora del día cuentas con opciones disponibles de transporte. Aquí te decimos a dónde va cada una, sus tarifas y puntos de abordaje.',
      categoriesTitle: 'Elige cómo quieres continuar tu viaje',
      categoryAction: 'Ver ruta y detalles',
      detailBack: 'Volver a opciones de transporte',
      itineraryTitle: 'Itinerario y abordaje',
      recommendationsTitle: 'Recomendaciones para tu viaje',
      boardingPointLabel: 'Punto de abordaje',
      prepaidCardLabel: 'Tarjeta de prepago requerida',
      cardFrontLabel: 'Frente',
      cardBackLabel: 'Reverso',
      taxiFareNote: 'Las tarifas varían según el destino y el servicio. Consulta y paga el precio vigente únicamente en la taquilla oficial antes de abordar.',
      busFareNote: 'Las tarifas y horarios dependen de la línea y el destino. Confirma precio, disponibilidad y andén en la taquilla o con el operador.',
      mexibus: {
        title: 'Mexibús Línea 1',
        summary: 'Conexión económica entre Ojo de Agua, Tecámac y la Terminal AIFA.',
        imageAlt: 'Acceso y andén del Mexibús',
      },
      suburban: {
        title: 'Tren Suburbano Lechería – AIFA',
        summary: 'Conexión ferroviaria entre Lechería y la zona aeroportuaria del AIFA.',
        imageAlt: 'Tren suburbano en una estación',
      },
      taxis: {
        title: 'Taxis autorizados y plataformas',
        summary: 'Traslados directos desde el área oficial de llegadas del aeropuerto.',
        details: 'Los módulos de taxis autorizados se encuentran en el área pública de llegadas. Para servicios por plataforma, sigue las indicaciones del aeropuerto al punto de recogida designado.',
        imageAlt: 'Área de llegadas y acceso a transporte terrestre en el AIFA',
      },
      buses: {
        title: 'Autobuses foráneos e interurbanos',
        summary: 'Salidas a ciudades y terminales regionales desde la terminal de autobuses.',
        details: 'La terminal ofrece conexiones a Puebla, Querétaro, Pachuca, Toluca y terminales de Ciudad de México como TAPO, Norte y Sur. Confirma el destino y andén antes de abordar.',
        imageAlt: 'Señalización de conexiones de transporte en la terminal del AIFA',
      },
      taxiRecommendations: [
        'Compra el servicio solo en taquillas oficiales y verifica el destino y el total antes de pagar.',
        'Para plataformas, utiliza únicamente el punto de recogida indicado por el aeropuerto y confirma los datos del vehículo.',
        'No aceptes ofertas de transporte de personas que aborden pasajeros fuera de las áreas autorizadas.'
      ],
      busRecommendations: [
        'Confirma destino, horario, disponibilidad y andén directamente con la línea de autobús.',
        'Compra el boleto en taquilla o en los canales oficiales del operador y conserva el comprobante.',
        'Llega con anticipación y mantén contigo tus documentos y equipaje.'
      ]
    },
    routeMap: {
      title: 'Rutas de transporte al AIFA',
      description: 'Explora las estaciones de cada conexión. Selecciona una estación para consultar su zona, conexiones locales y lugares de interés cercanos.',
      selectorLabel: 'Selecciona una ruta',
      mexibusLabel: 'Mexibús Línea 1 · Ojo de Agua — Terminal AIFA',
      suburbanLabel: 'Tren Suburbano · Lechería — AIFA',
      stationListLabel: 'Estaciones',
      stationDetailsLabel: 'Detalles de estación',
      frequencyLabel: 'Frecuencia estimada',
      travelTimeLabel: 'Recorrido completo estimado',
      minutesLabel: 'min',
      faresTitle: 'Tarifas Mexibús',
      generalFareLabel: 'Viaje general',
      cardFareLabel: 'Tarjeta Mexipase / Movimex (incluye 1 viaje)',
      transferTitle: 'Transbordo en Ojo de Agua',
      transferDescription: 'Gratuito con la misma tarjeta dentro de la misma línea. Presenta la tarjeta al hacer el transbordo.',
      estimateNote: 'Frecuencias y tiempos son estimados; pueden variar según operación y horario. Confirma información vigente con el operador. La tarifa del Tren Suburbano no se muestra aquí.',
      viewAirportMap: 'Ampliar mapa del AIFA',
      openImageLabel: 'Ampliar imagen en pantalla completa',
      closeViewerLabel: 'Cerrar visor de imagen',
      zoomInLabel: 'Acercar imagen',
      zoomOutLabel: 'Alejar imagen',
      resetZoomLabel: 'Restablecer zoom',
      gestureHint: 'Pellizca para ampliar · arrastra para desplazar · desliza hacia abajo para cerrar',
      stationDetails: {
        default: 'Ubicación: zona de {station}. Conexiones: consulta en sitio las rutas de transporte local disponibles. Cerca: servicios y comercios de la zona; confirma accesos y horarios.',
        'ojo-de-agua': 'Ubicación: estación Ojo de Agua, punto de conexión de la Línea 1. Conexiones: transbordo gratuito con la misma tarjeta dentro de la misma línea. Cerca: servicios y transporte local; confirma el punto de ascenso.',
        'tecamac-centro': 'Ubicación: centro de Tecámac. Conexiones: consulta transporte local hacia el centro y su plaza principal. Cerca: centro histórico; el Parque Sierra Hermosa requiere traslado local, confirma la ruta.',
        'terminal-aifa': 'Ubicación: terminal de pasajeros del AIFA. Conexiones: accesos a la terminal, taxis autorizados, autobuses y Tren Suburbano. Cerca: Corredor Cultural y museos del AIFA; revisa horarios y acceso público.',
        lecheria: 'Ubicación: estación Lechería, punto de conexión con el Tren Suburbano existente. Conexiones: servicios ferroviarios hacia el Valle de México; confirma transbordos y horarios.',
        aifa: 'Ubicación: estación de la zona aeroportuaria del AIFA. Conexiones: acceso al aeropuerto; sigue la señalización oficial hacia la terminal. Cerca: Corredor Cultural y museos; revisa horarios y acceso público.'
      }
    },
    routeGallery: {
      title: 'Ruta Mexibús a documentación',
      description: 'Sigue las imágenes en orden desde la estación hasta los mostradores de equipaje.',
      steps: [
        { stage: 'Estación Mexibús', title: 'Llegada y salida por torniquetes', description: 'Llegas a la estación Terminal de Pasajeros (última estación) y sales por los torniquetes para avanzar.', referencePoint: 'Piso podotáctil con franjas amarillas en relieve para guía visual y táctil.', accessibilityNote: 'Línea podotáctil presente en todo el trayecto inicial.' },
        { stage: 'Explanada de Conexión', title: 'Giro a la izquierda y paso peatonal', description: 'Avanza de 12 a 15 metros al frente y gira a la izquierda siguiendo la línea podotáctil. Cruza el paso cebra con precaución.', referencePoint: 'Bolardos lumínicos y bolardos metálicos de seguridad con franja reflectante.' },
        { stage: 'Área de Estacionamiento y Tren', title: 'Tránsito por pasillo de columnas (F a C)', description: 'Cruza la cebra del estacionamiento. A tu derecha verás las columnas por área. Cruzando a la derecha queda la entrada y salida del Tren Suburbano y la Terminal de Autobuses.', referencePoint: 'Columnas marcadas con letras D y F, maceteros perimetrales.' },
        { stage: 'Ingreso al Edificio Terminal', title: 'Acceso por Puerta 5 (Llegadas)', description: 'Continúa pasando las columnas C, B y A. Gira ligeramente a la izquierda para ingresar por la Puerta 5 de Llegadas.', referencePoint: 'Escultura gigante de dinosaurio volador (Pterodáctilo) suspendido en el techo.' },
        { stage: 'Ascenso a Salidas', title: 'Escaleras eléctricas a Vuelos de Salida', description: 'Cruza las puertas automáticas y gira a la izquierda. Toma las escaleras eléctricas señalizadas hacia Vuelos de Salida.', referencePoint: 'Letrero Vuelos de Salida al inicio de las escaleras.' },
        { stage: 'Área de Documentación', title: 'Llegada a mostradores de equipaje', description: 'Al subir las escaleras, gira a la derecha. Encontrarás los módulos de documentación de equipaje nacionales e internacionales.', referencePoint: 'Módulos de check-in y mostradores de aerolíneas.' }
      ]
    }
  },
  EN: {
    backToMenu: 'Back to Main Menu',
    backToOptions: 'Back to options',
    detectedLocation: 'Detected location',
    mapLocation: 'View location map →',
    walkingTime: 'walk',
    services: 'Services',
    attractions: 'Attractions',
    recommendation: 'Recommendation:',
    reference: 'Reference:',
    accessibility: 'Accessibility:',
    photoPoints: 'Photo spots',
    roles: {
      arrival: { title: 'I have arrived', subtitle: 'Baggage, immigration, and exit', description: 'Find your way after landing and discover the next step of your journey.', steps: ['Follow signs to baggage claim and arrivals.', 'Find services and transportation in the terminal.', 'Confirm your exit point before continuing.'] },
      departure: { title: 'I am travelling', subtitle: 'Check-in, security, and gates', description: 'Plan your departure and locate the key points before boarding.', steps: ['Check with your airline for its check-in counter.', 'Keep your documents ready for security screening.', 'Check the screens to confirm your lounge and gate.'] },
      pickup: { title: 'I am picking someone up', subtitle: 'Meeting point and arrivals', description: 'Arrange an easy meeting in the arrivals area and keep an eye on flight updates.', steps: ['Confirm the terminal and arrival time.', 'Choose an easy-to-recognize meeting point.', 'Follow signs to the public arrivals area.'] },
      tourism: { title: 'Tourism and leisure', subtitle: 'Museums, plaza, and themed restrooms', description: 'Explore the airport’s cultural and shopping spaces during your visit.', steps: ['Visit the Mammoth Museum and its cultural spaces.', 'Explore Plaza Mexicana and its services.', 'Follow signs to find the themed restrooms.'] },
      transport: { title: 'Transportation', subtitle: 'Options for the next leg of your trip', description: 'Find available ground connections and confirm schedules and boarding points.', steps: ['Follow official signs to transportation.', 'Confirm schedules, fares, and availability with the operator.', 'Keep your belongings secure during your trip.'] },
      'lost-items': { title: 'Lost property', subtitle: 'Help recovering your belongings', description: 'If you have lost something, report it with as many details as possible.', steps: ['Note where and when you last saw the item.', 'Describe the item and any identifying details.', 'Ask airport or airline staff for assistance.'] },
      pets: { title: 'Pets', subtitle: 'Get ready to travel with your companion animal', description: 'Check your airline’s rules and terminal services in advance.', steps: ['Confirm requirements and carrier rules directly with your airline.', 'Bring the required veterinary documents.', 'Keep your pet supervised in permitted areas.'] }
    },
    arrival: {
      title: 'I have arrived',
      description: 'Baggage, immigration, and exit: find what you need to continue your journey through AIFA.',
      cards: [
        { title: '1. Baggage Claim and Customs', description: 'Head to the baggage claim belts. If you arrive on an international flight, go through Immigration (INM).', badges: ['Belts 1–6', 'Immigration', 'Customs'] },
        { title: '2. Essential Terminal Services', description: 'Find ATMs, currency exchange, themed restrooms, medical care, and information desks near the exit.', badges: ['ATMs', 'Restrooms', 'Tourist Information'] },
        { title: '3. Transportation and Leaving AIFA', description: 'Connect directly to Mexibús Line 1, authorized taxis, intercity buses, or the parking area.', badges: ['Mexibús Line 1', 'Authorized Taxis', 'Intercity Buses', 'Parking'] }
      ],
      mapLink: 'View location map →'
    },
    departure: {
      title: 'I am travelling',
      description: 'Check-in, security, and gates: prepare for departure and find each step before boarding.',
      cards: [
        { title: '1. Check-in and Documentation', description: 'Find your airline counters or use digital kiosks to print your boarding pass and check in hold baggage.', badges: ['Counters A–F', 'Digital Kiosks', 'Baggage'], linkLabel: 'View counter map →' },
        { title: '2. Security Screening', description: 'Keep your boarding pass and official ID ready to enter the departure lounges.', badges: ['Boarding Pass', 'Official ID', 'Central Checkpoint'], linkLabel: 'View entry requirements →' },
        { title: '3. Departure Lounges and Boarding', description: 'Check the flight screens to confirm your lounge and boarding gate. Enjoy shops, services, and rest areas.', badges: ['Gates A1–A12', 'Flight Screens', 'Shopping Area'], linkLabel: 'Find my gate →' }
      ]
    },
    pickup: {
      title: 'I am picking someone up',
      description: 'Meeting points, parking, and services to wait comfortably for your passenger.',
      cards: [
        { title: '1. Meeting and Waiting Points', description: 'Find the domestic and international arrivals areas. Check live flight screens for arrival status.', badges: ['Domestic Arrivals', 'International Arrivals', 'Flight Screens'], linkLabel: 'View meeting point map →' },
        { title: '2. Parking and Timing', description: 'Use the main parking lot or short-stay waiting area to coordinate when your passenger exits the terminal.', badges: ['Main Parking', 'Digital / Card Payment', 'Pick-up Zone'], linkLabel: 'Parking rates and location →' },
        { title: '3. Comfortable Waiting Services', description: 'Find lounges, cafés, convenience stores, and restrooms while you wait for the flight to arrive.', badges: ['Cafés', 'Themed Restrooms', 'Free Wi-Fi'], linkLabel: 'View waiting amenities →' }
      ]
    },
    tourism: {
      title: 'Tourism and leisure',
      description: 'Explore AIFA’s museums, shopping experiences, and photo spots.',
      localAttractions: {
        title: 'Local Area · Tecámac Center',
        description: 'Discover natural, historic, and cultural sites near AIFA.',
        directionsLabel: 'Getting there from Mexibús Line 1',
        cards: [
          {
            title: 'Sierra Hermosa Park',
            description: 'A landmark natural and recreational space in Tecámac.',
            directions: 'From AIFA Passenger Terminal station, take Mexibús Line 1 toward Ojo de Agua. At Ojo de Agua, transfer to a local taxi or transit service to the park; confirm the drop-off point with the operator.'
          },
          {
            title: 'Tecámac Center & Main Plaza',
            description: 'Explore the historic town center and its main plaza.',
            directions: 'From Passenger Terminal, take Line 1 toward Ojo de Agua and get off at Ojo de Agua. Continue by local transit or taxi to central Tecámac and the Main Plaza; there is no Mexibús station at the plaza.'
          },
          {
            title: 'AIFA Cultural Corridor',
            description: 'Museums, aviation, and historic heritage around AIFA.',
            directions: 'Get off at AIFA Passenger Terminal station. Follow signs from there to the cultural corridor within the complex; check each venue’s opening hours and public access before visiting.'
          }
        ]
      },
      sections: [
        { title: '1. Cultural Corridor and Museums', description: 'Discover unique cultural spaces within the airport grounds.' },
        { title: '2. Shopping and Themed Restrooms', description: 'Explore Mexican popular culture attractions inside the terminal.' },
        { title: '3. Viewpoints and Photo Spots', description: 'Find the best spots for souvenir photos with the control tower and monumental letters.' }
      ],
      culturalAttractions: [
        { title: 'Mammoth Museum (Quinametzin)', badges: ['Fossils', 'Land of Giants'] },
        { title: 'Military Aviation Museum (MAM)', badges: ['Aircraft', 'Air Force'] },
        { title: 'Olivo Presidential Train', badges: ['Historic Railcar', 'History'] }
      ],
      commercialAttractions: [
        { title: 'Themed Restrooms', badges: ['Lucha Libre', 'Mexican Cinema', 'Chespirito'] },
        { title: 'Mexica Shopping Plaza', badges: ['Handicrafts', 'Souvenirs', 'Food'] }
      ],
      photoBadges: ['AIFA Letters', 'Main Lookout', 'Green Areas'],
      photoLink: 'View photo spots map →'
    },
    timeOfDay: { morning: 'Good morning', afternoon: 'Good afternoon', night: 'Good evening' },
    localTime: 'Local time',
    officialSite: 'Official AIFA website',
    footerDescription: 'Felipe Ángeles International Airport — Guiding you every step of the way.',
    modules: {
      museos: {
        title: 'Cultural Corridor and Museums', description: 'Cultural attractions within the Air Base and airport area.',
        steps: {
          'tur-1': { title: 'Quinamávida Paleontology Museum (Land of Giants)', description: 'A few minutes from the terminal. It displays mammoth and megafauna remains discovered during construction.', tip: 'You do not need a boarding pass to enter. Admission is free and open to everyone.' },
          'tur-2': { title: 'Military Aviation Museum (MAM)', description: 'A historic collection of Mexican Air Force aircraft in an interactive exhibit.', tip: 'Its real, interactive hangar is ideal for families before or after a flight.' },
          'tur-3': { title: 'Olivo Historic Train', description: 'A restored historic presidential railcar inside the military complex.' }
        }
      },
      'banos-tematicos': {
        title: 'Themed Restroom Route', description: 'A unique visual experience in the airport’s public restrooms.',
        steps: { 'tur-4': { title: 'Lucha Libre and Mexican Cinema Restrooms', description: 'Murals and décor celebrating Mexican popular culture in the main corridors.', tip: 'There are over 30 themed restrooms with different designs (Catrinas, El Chavo, Mariachi, Maya, and more).' } }
      },
      mexibus: {
        title: 'Mexibús (Line 1)', description: 'Direct connection to Ojo de Agua and Ciudad Azteca.',
        steps: {
          'trans-1': { title: 'Arrival at the AIFA Mexibús Terminal', description: 'Located on the ground floor / lower level of the passenger terminal.', tip: 'Pay with a Mexipase card. You can buy and top it up at the machines near the entrance.' },
          'trans-2': { title: 'Boarding and Route', description: 'Services run regularly to connecting stations in the State of Mexico and Mexico City.' }
        }
      },
      'taxis-autobuses': {
        title: 'Authorized Taxis and Intercity Buses', description: 'Ground transportation options to Mexico City and neighboring states.',
        steps: {
          'trans-3': { title: 'Authorized Taxi Counters', description: 'Located in the public arrivals area. Pay only at official counters before boarding.', tip: 'For your safety, never take a taxi outside the authorized area or without a ticket purchased at the counter.' },
          'trans-4': { title: 'Intercity Bus Terminal', description: 'Direct connections to Puebla, Querétaro, Pachuca, Toluca, and Mexico City terminals (TAPO, North, and South).' }
        }
      }
    },
    transport: {
      welcomeTitle: 'Looking for transportation to your destination?',
      welcomeDescription: 'Felipe Ángeles International Airport offers the following first-class transportation options to help you reach your destination on time and travel in comfort. In this section, you will find clearly defined transportation options and routes so you can find your way and enjoy your stay. Welcome!',
      heroCarouselLabel: 'Transportation options carousel',
      carouselRole: 'carousel',
      showSlideLabel: 'Show image',
      liveMessage: 'At this time of day, transportation options are available. Find out where each one goes, its fares, and where to board.',
      categoriesTitle: 'Choose how to continue your journey',
      categoryAction: 'View route and details',
      detailBack: 'Back to transportation options',
      itineraryTitle: 'Itinerary and boarding',
      recommendationsTitle: 'Travel recommendations',
      boardingPointLabel: 'Boarding point',
      prepaidCardLabel: 'Prepaid card required',
      cardFrontLabel: 'Front',
      cardBackLabel: 'Back',
      taxiFareNote: 'Fares vary by destination and service. Check and pay the current fare only at the official counter before boarding.',
      busFareNote: 'Fares and schedules depend on the operator and destination. Confirm the fare, availability, and bay at the counter or with the operator.',
      mexibus: {
        title: 'Mexibús Line 1',
        summary: 'Affordable connection between Ojo de Agua, Tecámac, and AIFA Terminal.',
        imageAlt: 'Mexibús station entrance and platform',
      },
      suburban: {
        title: 'Suburban Train Lechería – AIFA',
        summary: 'Rail connection between Lechería and the AIFA airport area.',
        imageAlt: 'Suburban train at a station',
      },
      taxis: {
        title: 'Authorized taxis and ride-hailing',
        summary: 'Direct rides from the airport’s official arrivals area.',
        details: 'Authorized taxi counters are in the public arrivals area. For ride-hailing services, follow airport signs to the designated pickup point.',
        imageAlt: 'Arrivals area and ground transportation access at AIFA',
      },
      buses: {
        title: 'Intercity and regional buses',
        summary: 'Services to cities and regional terminals from the bus terminal.',
        details: 'The terminal offers connections to Puebla, Querétaro, Pachuca, Toluca, and Mexico City terminals such as TAPO, North, and South. Confirm your destination and bay before boarding.',
        imageAlt: 'Transportation connection signs inside the AIFA terminal',
      },
      taxiRecommendations: [
        'Buy service only at official counters and verify your destination and total fare before paying.',
        'For ride-hailing, use only the airport-designated pickup point and verify the vehicle details.',
        'Do not accept transportation offers from people approaching passengers outside authorized areas.'
      ],
      busRecommendations: [
        'Confirm destination, schedule, availability, and boarding bay directly with the bus operator.',
        'Buy your ticket at the counter or through official operator channels, and keep your receipt.',
        'Arrive early and keep your travel documents and luggage with you.'
      ]
    },
    routeMap: {
      title: 'Transit routes to AIFA',
      description: 'Explore the stations on each connection. Select a station to see its area, local connections, and nearby points of interest.',
      selectorLabel: 'Choose a route',
      mexibusLabel: 'Mexibús Line 1 · Ojo de Agua — AIFA Terminal',
      suburbanLabel: 'Suburban Train · Lechería — AIFA',
      stationListLabel: 'Stations',
      stationDetailsLabel: 'Station details',
      frequencyLabel: 'Estimated frequency',
      travelTimeLabel: 'Estimated end-to-end journey',
      minutesLabel: 'min',
      faresTitle: 'Mexibús fares',
      generalFareLabel: 'Standard single ride',
      cardFareLabel: 'Mexipase / Movimex card (includes 1 ride)',
      transferTitle: 'Transfer at Ojo de Agua',
      transferDescription: 'Free with the same card on the same line. Present your card when transferring.',
      estimateNote: 'Frequencies and journey times are estimates and may vary by service and time of day. Confirm current information with the operator. The Suburban Train fare is not listed here.',
      viewAirportMap: 'Enlarge AIFA map',
      openImageLabel: 'View image full screen',
      closeViewerLabel: 'Close image viewer',
      zoomInLabel: 'Zoom in',
      zoomOutLabel: 'Zoom out',
      resetZoomLabel: 'Reset zoom',
      gestureHint: 'Pinch to zoom · drag to pan · swipe down to close',
      stationDetails: {
        default: 'Location: {station} area. Connections: check locally for available transport links. Nearby: local services and shops; confirm access and opening times.',
        'ojo-de-agua': 'Location: Ojo de Agua station, a Line 1 connection point. Connections: free transfer with the same card on the same line. Nearby: local services and transport; confirm the boarding point.',
        'tecamac-centro': 'Location: central Tecámac. Connections: check local transport to the town center and main square. Nearby: historic center; Sierra Hermosa Park requires local transport, so confirm the route.',
        'terminal-aifa': 'Location: AIFA passenger terminal. Connections: terminal access, authorized taxis, buses, and the Suburban Train. Nearby: AIFA Cultural Corridor and museums; check opening times and public access.',
        lecheria: 'Location: Lechería station, connected to the existing Suburban Train. Connections: rail services across the Valley of Mexico; confirm transfers and schedules.',
        aifa: 'Location: AIFA airport-area station. Connections: airport access; follow official signs to the terminal. Nearby: Cultural Corridor and museums; check opening times and public access.'
      }
    },
    routeGallery: {
      title: 'Mexibús route to check-in',
      description: 'Follow the images in order from the station to the baggage counters.',
      steps: [
        { stage: 'Mexibús Station', title: 'Arrival and exit through turnstiles', description: 'Arrive at the Passenger Terminal station (the last stop) and exit through the turnstiles to continue.', referencePoint: 'Tactile paving with raised yellow stripes for visual and tactile guidance.', accessibilityNote: 'Tactile paving runs along the entire initial route.' },
        { stage: 'Connection Plaza', title: 'Turn left and use the pedestrian crossing', description: 'Walk 12 to 15 meters straight ahead and turn left, following the tactile paving. Cross the zebra crossing carefully.', referencePoint: 'Lighted bollards and metal safety bollards with reflective stripes.' },
        { stage: 'Parking and Train Area', title: 'Walk along the column corridor (F to C)', description: 'Cross the parking-lot crossing. The area columns are on your right. Beyond them are the Suburban Train and Bus Terminal entrances.', referencePoint: 'Columns marked D and F, with planters around the perimeter.' },
        { stage: 'Terminal Building Entrance', title: 'Enter through Gate 5 (Arrivals)', description: 'Continue past columns C, B, and A. Turn slightly left to enter through Gate 5 for Arrivals.', referencePoint: 'A large flying dinosaur (pterodactyl) sculpture hanging from the ceiling.' },
        { stage: 'Up to Departures', title: 'Escalators to Departures', description: 'Go through the automatic doors and turn left. Take the escalators marked Departures.', referencePoint: 'Departures sign at the foot of the escalators.' },
        { stage: 'Check-in Area', title: 'Arrive at the baggage counters', description: 'At the top of the escalators, turn right. You will find domestic and international baggage check-in counters.', referencePoint: 'Check-in kiosks and airline counters.' }
      ]
    }
  },
  FR: {
    backToMenu: 'Retour au menu principal',
    backToOptions: 'Retour aux options',
    detectedLocation: 'Emplacement détecté',
    mapLocation: 'Voir le plan de l’emplacement →',
    walkingTime: 'à pied',
    services: 'Services',
    attractions: 'Attractions',
    recommendation: 'Conseil :',
    reference: 'Repère :',
    accessibility: 'Accessibilité :',
    photoPoints: 'Lieux pour les photos',
    roles: {
      arrival: { title: 'Je viens d’arriver', subtitle: 'Bagages, immigration et sortie', description: 'Orientez-vous à votre arrivée et trouvez la prochaine étape de votre parcours.', steps: ['Suivez les panneaux vers la récupération des bagages et les arrivées.', 'Repérez les services et les transports dans le terminal.', 'Confirmez votre point de sortie avant de poursuivre.'] },
      departure: { title: 'Je vais voyager', subtitle: 'Enregistrement, contrôles et portes', description: 'Organisez votre départ et repérez les points essentiels avant l’embarquement.', steps: ['Vérifiez auprès de votre compagnie le comptoir d’enregistrement.', 'Gardez vos documents à portée de main pour les contrôles.', 'Consultez les écrans pour confirmer votre salle et votre porte.'] },
      pickup: { title: 'Je viens chercher quelqu’un', subtitle: 'Point de rencontre et arrivées', description: 'Organisez un rendez-vous simple dans la zone des arrivées et consultez les informations de vol.', steps: ['Confirmez le terminal et l’heure d’arrivée.', 'Choisissez un point de rencontre facile à reconnaître.', 'Suivez les panneaux vers la zone publique des arrivées.'] },
      tourism: { title: 'Tourisme et loisirs', subtitle: 'Musées, place et toilettes à thème', description: 'Explorez les espaces culturels et commerciaux de l’aéroport pendant votre visite.', steps: ['Visitez le Musée du Mammouth et ses espaces culturels.', 'Découvrez la Plaza Mexicana et ses services.', 'Suivez les panneaux vers les toilettes à thème.'] },
      transport: { title: 'Transports', subtitle: 'Options pour poursuivre votre trajet', description: 'Repérez les liaisons terrestres et confirmez les horaires et lieux d’embarquement.', steps: ['Suivez la signalisation officielle vers les transports.', 'Confirmez les horaires, tarifs et disponibilités auprès de l’opérateur.', 'Gardez vos effets personnels avec vous pendant le trajet.'] },
      'lost-items': { title: 'Objets trouvés', subtitle: 'Conseils pour récupérer vos affaires', description: 'Si vous avez oublié un objet, signalez-le avec le plus de détails possible.', steps: ['Notez où et quand vous avez vu l’objet pour la dernière fois.', 'Décrivez l’objet et tout élément permettant de l’identifier.', 'Demandez conseil au personnel de l’aéroport ou de votre compagnie.'] },
      pets: { title: 'Animaux de compagnie', subtitle: 'Préparez le voyage avec votre compagnon', description: 'Consultez à l’avance les règles de votre compagnie et les services du terminal.', steps: ['Confirmez les exigences et la caisse auprès de votre compagnie.', 'Emportez les documents vétérinaires requis.', 'Surveillez votre animal dans les zones autorisées.'] }
    },
    arrival: {
      title: 'Je viens d’arriver',
      description: 'Bagages, immigration et sortie : trouvez ce qu’il vous faut pour poursuivre votre parcours à l’AIFA.',
      cards: [
        { title: '1. Récupération des bagages et contrôle', description: 'Rendez-vous aux tapis de récupération des bagages. Pour un vol international, passez le contrôle de l’immigration (INM).', badges: ['Tapis 1–6', 'Immigration', 'Douane'] },
        { title: '2. Services essentiels du terminal', description: 'Trouvez des distributeurs, bureaux de change, toilettes à thème, soins médicaux et comptoirs d’information à la sortie.', badges: ['Distributeurs', 'Toilettes', 'Info touristique'] },
        { title: '3. Transports et sortie de l’AIFA', description: 'Rejoignez directement le Mexibús ligne 1, les taxis autorisés, les autocars ou le parking.', badges: ['Mexibús ligne 1', 'Taxis autorisés', 'Autocars', 'Parking'] }
      ],
      mapLink: 'Voir le plan de l’emplacement →'
    },
    departure: {
      title: 'Je vais voyager',
      description: 'Enregistrement, contrôles et portes : préparez votre départ et repérez chaque étape avant l’embarquement.',
      cards: [
        { title: '1. Enregistrement et formalités', description: 'Repérez les comptoirs de votre compagnie ou utilisez les bornes pour imprimer votre carte d’embarquement et enregistrer vos bagages en soute.', badges: ['Comptoirs A–F', 'Bornes numériques', 'Bagages'], linkLabel: 'Voir le plan des comptoirs →' },
        { title: '2. Contrôles de sécurité', description: 'Gardez votre carte d’embarquement et votre pièce d’identité à portée de main pour accéder aux salles d’embarquement.', badges: ['Carte d’embarquement', 'Pièce d’identité', 'Contrôle central'], linkLabel: 'Voir les conditions d’accès →' },
        { title: '3. Salles et embarquement', description: 'Consultez les écrans pour confirmer votre salle et votre porte. Profitez des boutiques, services et espaces de repos.', badges: ['Portes A1–A12', 'Écrans des vols', 'Zone commerciale'], linkLabel: 'Trouver ma porte →' }
      ]
    },
    pickup: {
      title: 'Je viens chercher quelqu’un',
      description: 'Points de rencontre, parking et services pour attendre confortablement votre passager.',
      cards: [
        { title: '1. Points de rencontre et d’attente', description: 'Repérez les arrivées nationales et internationales. Consultez les écrans en temps réel pour connaître l’état du vol.', badges: ['Arrivées nationales', 'Arrivées internationales', 'Écrans des vols'], linkLabel: 'Voir le plan des rencontres →' },
        { title: '2. Parking et horaires', description: 'Utilisez le parking principal ou la zone d’attente courte pour coordonner la sortie de votre passager.', badges: ['Parking principal', 'Paiement numérique / carte', 'Zone de prise en charge'], linkLabel: 'Tarifs et emplacement du parking →' },
        { title: '3. Services pour patienter confortablement', description: 'Trouvez des espaces de repos, cafés, commerces et toilettes en attendant l’arrivée du vol.', badges: ['Cafés', 'Toilettes à thème', 'Wi-Fi gratuit'], linkLabel: 'Voir les services d’attente →' }
      ]
    },
    tourism: {
      title: 'Tourisme et loisirs',
      description: 'Explorez les musées, commerces et lieux de photographie de l’AIFA.',
      localAttractions: {
        title: 'Environs · Centre de Tecámac',
        description: 'Découvrez des espaces naturels, historiques et culturels près de l’AIFA.',
        directionsLabel: 'Itinéraire depuis le Mexibús ligne 1',
        cards: [
          {
            title: 'Parc Sierra Hermosa',
            description: 'Un espace naturel et de loisirs emblématique de Tecámac.',
            directions: 'Depuis la station Terminal de pasajeros de l’AIFA, prenez le Mexibús ligne 1 en direction d’Ojo de Agua. À Ojo de Agua, prenez un taxi ou un transport local jusqu’au parc ; confirmez le point de descente auprès du conducteur.'
          },
          {
            title: 'Centre de Tecámac et place principale',
            description: 'Découvrez le centre historique et sa place principale.',
            directions: 'Depuis la station Terminal de pasajeros, prenez la ligne 1 vers Ojo de Agua et descendez à Ojo de Agua. Continuez en transport local ou en taxi jusqu’au centre de Tecámac et à la place principale ; celle-ci ne dispose pas de station Mexibús.'
          },
          {
            title: 'Corridor culturel de l’AIFA',
            description: 'Musées, aviation et patrimoine historique autour de l’AIFA.',
            directions: 'Descendez à la station Terminal de pasajeros de l’AIFA. Suivez ensuite les panneaux vers le corridor culturel dans le complexe ; vérifiez les horaires et l’accès public de chaque site avant votre visite.'
          }
        ]
      },
      sections: [
        { title: '1. Corridor culturel et musées', description: 'Découvrez des espaces culturels uniques au sein de la zone aéroportuaire.' },
        { title: '2. Commerces et toilettes à thème', description: 'Parcourez les attractions de la culture populaire mexicaine dans le terminal.' },
        { title: '3. Belvédères et lieux pour les photos', description: 'Trouvez les meilleurs endroits pour des photos souvenirs avec la tour de contrôle et les lettres monumentales.' }
      ],
      culturalAttractions: [
        { title: 'Musée du Mammouth (Quinametzin)', badges: ['Fossiles', 'Terre des Géants'] },
        { title: 'Musée de l’aviation militaire (MAM)', badges: ['Avions', 'Force aérienne'] },
        { title: 'Train présidentiel Olivo', badges: ['Wagon historique', 'Histoire'] }
      ],
      commercialAttractions: [
        { title: 'Toilettes à thème', badges: ['Lucha Libre', 'Cinéma mexicain', 'Chespirito'] },
        { title: 'Centre commercial Mexica', badges: ['Artisanat', 'Souvenirs', 'Gastronomie'] }
      ],
      photoBadges: ['Lettres AIFA', 'Belvédère principal', 'Espaces verts'],
      photoLink: 'Voir le plan des lieux photo →'
    },
    timeOfDay: { morning: 'Bonjour', afternoon: 'Bon après-midi', night: 'Bonsoir' },
    localTime: 'Heure locale',
    officialSite: 'Site officiel de l’AIFA',
    footerDescription: 'Aéroport international Felipe Ángeles — Nous vous guidons pas à pas.',
    modules: {
      museos: {
        title: 'Corridor culturel et musées', description: 'Attractions culturelles au sein de la base aérienne et de la zone aéroportuaire.',
        steps: {
          'tur-1': { title: 'Musée paléontologique Quinamávida (Terre des Géants)', description: 'À quelques minutes du terminal. Il présente des restes de mammouths et de mégafaune découverts lors des travaux.', tip: 'La carte d’embarquement n’est pas nécessaire. L’entrée est gratuite et ouverte à tous.' },
          'tur-2': { title: 'Musée de l’aviation militaire (MAM)', description: 'Collection historique d’aéronefs de la Force aérienne mexicaine présentée de manière interactive.', tip: 'Son hangar réel et interactif est idéal pour une visite en famille avant ou après un vol.' },
          'tur-3': { title: 'Train historique Olivo', description: 'Wagon présidentiel historique restauré au sein du complexe militaire.' }
        }
      },
      'banos-tematicos': {
        title: 'Parcours des toilettes à thème', description: 'Une expérience visuelle unique dans les toilettes publiques de l’aéroport.',
        steps: { 'tur-4': { title: 'Toilettes Lucha Libre et cinéma mexicain', description: 'Des fresques et une décoration dédiées à la culture populaire mexicaine dans les couloirs principaux.', tip: 'Plus de 30 toilettes à thème présentent des décors différents (Catrinas, El Chavo, Mariachi, Maya, etc.).' } }
      },
      mexibus: {
        title: 'Mexibús (ligne 1)', description: 'Liaison directe avec Ojo de Agua et Ciudad Azteca.',
        steps: {
          'trans-1': { title: 'Arrivée à la gare Mexibús de l’AIFA', description: 'Située au rez-de-chaussée / niveau inférieur du terminal passagers.', tip: 'Le paiement s’effectue avec une carte Mexipase, disponible et rechargeable aux distributeurs à l’entrée.' },
          'trans-2': { title: 'Embarquement et trajet', description: 'Les véhicules circulent régulièrement vers les stations de correspondance de l’État de Mexico et de Mexico.' }
        }
      },
      'taxis-autobuses': {
        title: 'Taxis autorisés et autocars', description: 'Options de transport terrestre vers Mexico et les États voisins.',
        steps: {
          'trans-3': { title: 'Comptoirs de taxis autorisés', description: 'Dans la zone publique des arrivées. Payez uniquement aux comptoirs officiels avant de monter.', tip: 'Pour votre sécurité, ne prenez jamais un taxi hors de la zone autorisée ou sans billet acheté au comptoir.' },
          'trans-4': { title: 'Gare routière (autocars)', description: 'Liaisons directes vers Puebla, Querétaro, Pachuca, Toluca et les gares routières de Mexico (TAPO, Nord et Sud).' }
        }
      }
    },
    transport: {
      welcomeTitle: 'Vous cherchez un moyen de transport pour rejoindre votre destination ?',
      welcomeDescription: 'L’aéroport international Felipe Ángeles propose les moyens de transport de premier ordre suivants pour vous permettre d’arriver à destination à l’heure et de vous déplacer confortablement. Vous trouverez dans cette section des moyens de transport et des itinéraires clairement définis pour vous orienter et profiter pleinement de votre séjour. Bienvenue !',
      heroCarouselLabel: 'Carrousel des moyens de transport',
      carouselRole: 'carrousel',
      showSlideLabel: 'Afficher l’image',
      liveMessage: 'À cette heure, plusieurs options de transport sont disponibles. Découvrez leurs destinations, tarifs et points d’embarquement.',
      categoriesTitle: 'Choisissez la suite de votre voyage',
      categoryAction: 'Voir l’itinéraire et les détails',
      detailBack: 'Retour aux options de transport',
      itineraryTitle: 'Itinéraire et embarquement',
      recommendationsTitle: 'Conseils pour votre trajet',
      boardingPointLabel: 'Point d’embarquement',
      prepaidCardLabel: 'Carte prépayée requise',
      cardFrontLabel: 'Recto',
      cardBackLabel: 'Verso',
      taxiFareNote: 'Les tarifs varient selon la destination et le service. Vérifiez et payez le tarif en vigueur uniquement au guichet officiel avant de monter.',
      busFareNote: 'Les tarifs et horaires dépendent de la ligne et de la destination. Confirmez le tarif, la disponibilité et le quai au guichet ou auprès de l’opérateur.',
      mexibus: {
        title: 'Mexibús ligne 1',
        summary: 'Liaison économique entre Ojo de Agua, Tecámac et le terminal AIFA.',
        imageAlt: 'Accès et quai de la station Mexibús',
      },
      suburban: {
        title: 'Train suburbain Lechería – AIFA',
        summary: 'Liaison ferroviaire entre Lechería et la zone aéroportuaire de l’AIFA.',
        imageAlt: 'Train suburbain en gare',
      },
      taxis: {
        title: 'Taxis autorisés et plateformes',
        summary: 'Trajets directs depuis la zone officielle des arrivées de l’aéroport.',
        details: 'Les guichets des taxis autorisés se trouvent dans la zone publique des arrivées. Pour les plateformes, suivez les panneaux de l’aéroport jusqu’au point de prise en charge désigné.',
        imageAlt: 'Zone des arrivées et accès aux transports terrestres de l’AIFA',
      },
      buses: {
        title: 'Autocars interurbains et régionaux',
        summary: 'Départs vers des villes et gares régionales depuis la gare routière.',
        details: 'La gare routière dessert Puebla, Querétaro, Pachuca, Toluca et les gares de Mexico telles que TAPO, Norte et Sur. Confirmez la destination et le quai avant l’embarquement.',
        imageAlt: 'Panneaux de correspondance dans le terminal de l’AIFA',
      },
      taxiRecommendations: [
        'Achetez votre trajet uniquement aux guichets officiels et vérifiez la destination et le prix total avant de payer.',
        'Pour les plateformes, utilisez uniquement le point de prise en charge indiqué par l’aéroport et vérifiez les informations du véhicule.',
        'Refusez les offres de transport proposées hors des zones autorisées.'
      ],
      busRecommendations: [
        'Confirmez la destination, l’horaire, la disponibilité et le quai directement auprès de l’opérateur.',
        'Achetez votre billet au guichet ou par les canaux officiels de l’opérateur et conservez le justificatif.',
        'Arrivez à l’avance et gardez vos documents et bagages avec vous.'
      ]
    },
    routeMap: {
      title: 'Itinéraires de transport vers l’AIFA',
      description: 'Explorez les stations de chaque liaison. Sélectionnez une station pour connaître son secteur, les correspondances locales et les lieux d’intérêt à proximité.',
      selectorLabel: 'Choisir un itinéraire',
      mexibusLabel: 'Mexibús ligne 1 · Ojo de Agua — Terminal AIFA',
      suburbanLabel: 'Train suburbain · Lechería — AIFA',
      stationListLabel: 'Stations',
      stationDetailsLabel: 'Détails de la station',
      frequencyLabel: 'Fréquence estimée',
      travelTimeLabel: 'Durée estimée du trajet complet',
      minutesLabel: 'min',
      faresTitle: 'Tarifs du Mexibús',
      generalFareLabel: 'Voyage simple',
      cardFareLabel: 'Carte Mexipase / Movimex (1 voyage inclus)',
      transferTitle: 'Correspondance à Ojo de Agua',
      transferDescription: 'Gratuite avec la même carte sur la même ligne. Présentez votre carte lors de la correspondance.',
      estimateNote: 'Les fréquences et durées sont estimatives et peuvent varier selon le service et l’horaire. Confirmez les informations auprès de l’opérateur. Le tarif du train suburbain n’est pas indiqué ici.',
      viewAirportMap: 'Agrandir le plan de l’AIFA',
      openImageLabel: 'Afficher l’image en plein écran',
      closeViewerLabel: 'Fermer la visionneuse',
      zoomInLabel: 'Zoom avant',
      zoomOutLabel: 'Zoom arrière',
      resetZoomLabel: 'Réinitialiser le zoom',
      gestureHint: 'Pincez pour zoomer · faites glisser pour déplacer · balayez vers le bas pour fermer',
      stationDetails: {
        default: 'Emplacement : secteur de {station}. Correspondances : renseignez-vous sur place sur les transports locaux disponibles. À proximité : commerces et services du quartier ; vérifiez les accès et horaires.',
        'ojo-de-agua': 'Emplacement : station Ojo de Agua, point de correspondance de la ligne 1. Correspondances : gratuites avec la même carte sur la même ligne. À proximité : services et transports locaux ; confirmez le point de montée.',
        'tecamac-centro': 'Emplacement : centre de Tecámac. Correspondances : renseignez-vous sur les transports locaux vers le centre et sa place principale. À proximité : centre historique ; le parc Sierra Hermosa nécessite un transport local, confirmez l’itinéraire.',
        'terminal-aifa': 'Emplacement : terminal passagers de l’AIFA. Correspondances : accès au terminal, taxis autorisés, autocars et train suburbain. À proximité : corridor culturel et musées de l’AIFA ; vérifiez les horaires et l’accès public.',
        lecheria: 'Emplacement : station Lechería, reliée au train suburbain existant. Correspondances : services ferroviaires dans la vallée de Mexico ; confirmez les correspondances et horaires.',
        aifa: 'Emplacement : station dans la zone aéroportuaire de l’AIFA. Correspondances : accès à l’aéroport ; suivez la signalisation officielle vers le terminal. À proximité : corridor culturel et musées ; vérifiez les horaires et l’accès public.'
      }
    },
    routeGallery: {
      title: 'Itinéraire Mexibús vers l’enregistrement',
      description: 'Suivez les images dans l’ordre, de la station aux comptoirs à bagages.',
      steps: [
        { stage: 'Station Mexibús', title: 'Arrivée et sortie par les tourniquets', description: 'Descendez à la station Terminal des passagers (dernier arrêt) et sortez par les tourniquets pour continuer.', referencePoint: 'Bandes podotactiles jaunes en relief pour un guidage visuel et tactile.', accessibilityNote: 'Une ligne podotactile est présente sur tout le début du parcours.' },
        { stage: 'Esplanade de correspondance', title: 'Tourner à gauche et traverser', description: 'Avancez de 12 à 15 mètres puis tournez à gauche en suivant la ligne podotactile. Traversez prudemment le passage piéton.', referencePoint: 'Potelets lumineux et potelets de sécurité métalliques avec bandes réfléchissantes.' },
        { stage: 'Parking et train', title: 'Passage le long des colonnes (F à C)', description: 'Traversez le passage piéton du parking. Les colonnes se trouvent à droite. Plus loin se trouvent les accès au train suburbain et à la gare routière.', referencePoint: 'Colonnes marquées D et F, jardinières périphériques.' },
        { stage: 'Entrée du terminal', title: 'Accès par la porte 5 (Arrivées)', description: 'Continuez après les colonnes C, B et A. Tournez légèrement à gauche pour entrer par la porte 5 des arrivées.', referencePoint: 'Une grande sculpture de ptérodactyle suspendue au plafond.' },
        { stage: 'Montée vers les départs', title: 'Escaliers mécaniques vers les départs', description: 'Franchissez les portes automatiques et tournez à gauche. Prenez les escaliers mécaniques indiqués vers les départs.', referencePoint: 'Panneau Départs au début des escaliers.' },
        { stage: 'Zone d’enregistrement', title: 'Arrivée aux comptoirs à bagages', description: 'En haut des escaliers, tournez à droite. Vous trouverez les comptoirs d’enregistrement des bagages nationaux et internationaux.', referencePoint: 'Bornes d’enregistrement et comptoirs des compagnies.' }
      ]
    }
  },
  ZH: {
    backToMenu: '返回主菜单',
    backToOptions: '返回选项',
    detectedLocation: '已检测到的位置',
    mapLocation: '查看位置地图 →',
    walkingTime: '步行',
    services: '服务',
    attractions: '景点',
    recommendation: '建议：',
    reference: '参考点：',
    accessibility: '无障碍：',
    photoPoints: '拍照地点',
    roles: {
      arrival: { title: '我已抵达', subtitle: '行李、入境与出口', description: '抵达后为您指引方向，帮助您找到旅程的下一步。', steps: ['沿指示牌前往行李提取和到达区。', '在航站楼内查找服务和交通。', '继续行程前确认您的出口位置。'] },
      departure: { title: '我要出发', subtitle: '值机、安检与登机口', description: '提前规划出发，并在登机前找到重要地点。', steps: ['向航空公司确认值机柜台。', '准备好证件以便通过安检。', '查看航班屏幕确认候机区和登机口。'] },
      pickup: { title: '我来接人', subtitle: '会合地点与到达信息', description: '在到达区安排方便的会合地点，并留意航班信息。', steps: ['确认航站楼和抵达时间。', '选择容易辨认的会合地点。', '沿指示牌前往公共到达区。'] },
      tourism: { title: '观光与休闲', subtitle: '博物馆、广场与主题洗手间', description: '在机场参观文化和商业空间。', steps: ['参观猛犸象博物馆及文化空间。', '游览墨西哥广场并了解相关服务。', '按照指示寻找主题洗手间。'] },
      transport: { title: '交通', subtitle: '继续行程的交通选择', description: '查找可用的地面交通，并确认时刻表和乘车地点。', steps: ['沿官方指示前往交通区域。', '向运营方确认时刻、票价和服务情况。', '旅途中请保管好随身物品。'] },
      'lost-items': { title: '失物招领', subtitle: '寻回遗失物品的指引', description: '如果遗失物品，请尽可能详细地进行报告。', steps: ['记录最后一次看到物品的时间和地点。', '描述物品及可用于识别的信息。', '向机场或航空公司工作人员寻求帮助。'] },
      pets: { title: '宠物', subtitle: '与您的宠物一起做好出行准备', description: '提前了解航空公司的规定和航站楼内的服务。', steps: ['直接向航空公司确认要求和宠物箱规定。', '携带所需的兽医文件。', '在允许区域内照看好宠物。'] }
    },
    arrival: {
      title: '我已抵达',
      description: '行李、入境与出口：查找在 AIFA 继续行程所需的信息。',
      cards: [
        { title: '1. 行李提取与入境检查', description: '前往行李提取转盘。国际航班旅客请通过移民局（INM）检查。', badges: ['1–6号转盘', '移民检查', '海关'] },
        { title: '2. 航站楼基本服务', description: '在出口附近查找自动取款机、货币兑换、主题洗手间、医疗服务和信息柜台。', badges: ['自动取款机', '洗手间', '旅游信息'] },
        { title: '3. 交通与离开 AIFA', description: '可直接换乘 Mexibús 1号线、授权出租车、长途巴士或前往停车场。', badges: ['Mexibús 1号线', '授权出租车', '长途巴士', '停车场'] }
      ],
      mapLink: '查看位置地图 →'
    },
    departure: {
      title: '我要出发',
      description: '值机、安检与登机口：提前做好出发准备，了解登机前的各个环节。',
      cards: [
        { title: '1. 值机与行李托运', description: '查找航空公司柜台，或使用自助设备打印登机牌并托运行李。', badges: ['A–F柜台', '自助设备', '行李'], linkLabel: '查看柜台地图 →' },
        { title: '2. 安全检查', description: '准备好登机牌和有效身份证件，以便进入候机区。', badges: ['登机牌', '有效证件', '中央安检'], linkLabel: '查看进入要求 →' },
        { title: '3. 候机与登机', description: '查看航班屏幕确认候机区和登机口。您也可以使用商店、服务和休息区。', badges: ['A1–A12号登机口', '航班屏幕', '商业区'], linkLabel: '查找登机口 →' }
      ]
    },
    pickup: {
      title: '我来接人',
      description: '会合地点、停车和各项服务，让您舒适地等候旅客抵达。',
      cards: [
        { title: '1. 会合与等候地点', description: '查找国内和国际到达区。查看实时航班屏幕了解抵达状态。', badges: ['国内到达', '国际到达', '航班屏幕'], linkLabel: '查看会合地点地图 →' },
        { title: '2. 停车与时间安排', description: '使用主停车场或短时等候区，协调旅客离开航站楼的时间。', badges: ['主停车场', '电子支付 / 银行卡', '接客区'], linkLabel: '停车费率和位置 →' },
        { title: '3. 舒适等候服务', description: '等候航班抵达时，可前往休息区、咖啡馆、便利店和洗手间。', badges: ['咖啡馆', '主题洗手间', '免费 Wi-Fi'], linkLabel: '查看等候设施 →' }
      ]
    },
    tourism: {
      title: '观光与休闲',
      description: '探索 AIFA 的博物馆、商业体验和拍照地点。',
      localAttractions: {
        title: '周边地区 · Tecámac 市中心',
        description: '探索 AIFA 附近的自然、历史与文化景点。',
        directionsLabel: '从 Mexibús 1 号线前往',
        cards: [
          {
            title: 'Sierra Hermosa 公园',
            description: 'Tecámac 标志性的自然与休闲空间。',
            directions: '从 AIFA 旅客航站楼站乘坐 Mexibús 1 号线，前往 Ojo de Agua。在 Ojo de Agua 换乘当地出租车或交通工具前往公园；请与运营人员确认下车地点。'
          },
          {
            title: 'Tecámac 市中心与主广场',
            description: '游览历史中心及其主广场。',
            directions: '从旅客航站楼站乘坐 1 号线前往 Ojo de Agua，并在 Ojo de Agua 下车。之后乘坐当地交通工具或出租车前往 Tecámac 市中心和主广场；广场没有 Mexibús 车站。'
          },
          {
            title: 'AIFA 文化长廊',
            description: 'AIFA 周边的博物馆、航空与历史遗产。',
            directions: '在 AIFA 旅客航站楼站下车，然后按照指示前往园区内的文化长廊；出发前请确认各场馆的开放时间及公众参观安排。'
          }
        ]
      },
      sections: [
        { title: '1. 文化长廊与博物馆', description: '探索机场区域内独特的文化空间。' },
        { title: '2. 商业体验与主题洗手间', description: '在航站楼内体验墨西哥流行文化景点。' },
        { title: '3. 观景点与拍照地点', description: '寻找最佳拍照位置，欣赏控制塔和大型纪念字母。' }
      ],
      culturalAttractions: [
        { title: '猛犸象博物馆（Quinametzin）', badges: ['化石', '巨人之地'] },
        { title: '军事航空博物馆（MAM）', badges: ['飞机', '空军'] },
        { title: '奥利沃总统列车', badges: ['历史车厢', '历史'] }
      ],
      commercialAttractions: [
        { title: '主题洗手间', badges: ['墨西哥摔跤', '墨西哥电影', 'Chespirito'] },
        { title: 'Mexica 商业广场', badges: ['手工艺品', '纪念品', '美食'] }
      ],
      photoBadges: ['AIFA 字母标志', '主观景台', '绿地'],
      photoLink: '查看拍照地点地图 →'
    },
    timeOfDay: { morning: '早上好', afternoon: '下午好', night: '晚上好' },
    localTime: '当地时间',
    officialSite: 'AIFA 官方网站',
    footerDescription: '费利佩·安赫莱斯国际机场 — 一步步为您指引。',
    modules: {
      museos: {
        title: '文化长廊与博物馆', description: '空军基地及机场区域内的文化景点。',
        steps: {
          'tur-1': { title: 'Quinamávida 古生物博物馆（巨人之地）', description: '距离航站楼数分钟，展出建设期间发现的猛犸象及大型动物遗骸。', tip: '无需登机牌即可参观，免费向公众开放。' },
          'tur-2': { title: '军事航空博物馆（MAM）', description: '以互动形式展出墨西哥空军历史飞机。', tip: '真实互动机库适合家庭在航班前后参观。' },
          'tur-3': { title: '奥利沃历史列车', description: '在军事建筑群内修复保存的历史总统车厢。' }
        }
      },
      'banos-tematicos': {
        title: '主题洗手间路线', description: '体验机场公共洗手间的独特视觉设计。',
        steps: { 'tur-4': { title: '墨西哥摔跤与电影主题洗手间', description: '主通道内的壁画和装饰展现墨西哥流行文化。', tip: '机场有30多个不同设计的主题洗手间（Catrinas、El Chavo、流浪乐队、玛雅等）。' } }
      },
      mexibus: {
        title: 'Mexibús（1号线）', description: '直达 Ojo de Agua 和 Ciudad Azteca。',
        steps: {
          'trans-1': { title: '抵达 AIFA Mexibús 站', description: '位于旅客航站楼底层 / 下层。', tip: '使用 Mexipase 卡付费，可在入口处的机器购买和充值。' },
          'trans-2': { title: '乘车与线路', description: '车辆定期发往墨西哥州和墨西哥城的换乘站。' }
        }
      },
      'taxis-autobuses': {
        title: '授权出租车与长途巴士', description: '前往墨西哥城及邻近州的地面交通选择。',
        steps: {
          'trans-3': { title: '授权出租车柜台', description: '位于公共到达区。请在上车前仅于官方柜台付款。', tip: '为确保安全，请勿搭乘授权区域外的出租车，或未在柜台购票的出租车。' },
          'trans-4': { title: '长途巴士站', description: '可直达 Puebla、Querétaro、Pachuca、Toluca 以及墨西哥城各汽车站（TAPO、北站、南站）。' }
        }
      }
    },
    transport: {
      welcomeTitle: '正在寻找前往目的地的交通方式吗？',
      welcomeDescription: '费利佩·安赫莱斯国际机场提供以下一流交通方式，助您准时抵达目的地并舒适出行。本栏目清晰介绍各类交通方式及路线，让您轻松找到方向，尽享旅程。欢迎！',
      heroCarouselLabel: '交通方式轮播图',
      carouselRole: '轮播图',
      showSlideLabel: '显示图片',
      liveMessage: '此时有多种交通方式可供选择。这里可以查看各线路目的地、票价和乘车点。',
      categoriesTitle: '选择继续行程的方式',
      categoryAction: '查看线路和详情',
      detailBack: '返回交通选项',
      itineraryTitle: '行程与乘车',
      recommendationsTitle: '出行建议',
      boardingPointLabel: '乘车地点',
      prepaidCardLabel: '需要预付费卡',
      cardFrontLabel: '正面',
      cardBackLabel: '背面',
      taxiFareNote: '票价因目的地和服务而异。请在上车前仅于官方柜台查询并支付当前票价。',
      busFareNote: '票价和时刻表因线路及目的地而异。请在柜台或向运营方确认票价、班次和站台。',
      mexibus: {
        title: 'Mexibús 1号线',
        summary: '连接 Ojo de Agua、Tecámac 和 AIFA 航站楼的经济线路。',
        imageAlt: 'Mexibús 车站入口和站台',
      },
      suburban: {
        title: '城郊铁路 Lechería – AIFA',
        summary: '连接 Lechería 与 AIFA 机场区域的铁路线路。',
        imageAlt: '车站内的城郊列车',
      },
      taxis: {
        title: '授权出租车和网约车',
        summary: '从机场官方到达区出发的直达服务。',
        details: '授权出租车柜台位于公共到达区。如使用网约车，请按照机场指示前往指定上车点。',
        imageAlt: 'AIFA 到达区及地面交通入口',
      },
      buses: {
        title: '城际及区域巴士',
        summary: '从巴士站前往各城市和区域汽车站。',
        details: '巴士站提供前往 Puebla、Querétaro、Pachuca、Toluca 以及墨西哥城 TAPO、北站和南站的线路。上车前请确认目的地和站台。',
        imageAlt: 'AIFA 航站楼内的交通换乘指示牌',
      },
      taxiRecommendations: [
        '仅在官方柜台购买服务，付款前确认目的地和总价。',
        '使用网约车时，仅前往机场指定上车点，并核对车辆信息。',
        '请勿接受授权区域以外人员主动提供的交通服务。'
      ],
      busRecommendations: [
        '直接向巴士运营方确认目的地、时刻、班次和站台。',
        '请在柜台或运营方官方渠道购票，并保留凭证。',
        '提前抵达，并随身保管证件和行李。'
      ]
    },
    routeMap: {
      title: '前往 AIFA 的交通线路',
      description: '查看各条线路的车站。选择车站可了解所在区域、本地换乘和附近景点。',
      selectorLabel: '选择线路',
      mexibusLabel: 'Mexibús 1号线 · Ojo de Agua — AIFA 航站楼',
      suburbanLabel: '城郊铁路 · Lechería — AIFA',
      stationListLabel: '车站',
      stationDetailsLabel: '车站详情',
      frequencyLabel: '预计发车间隔',
      travelTimeLabel: '全程预计时间',
      minutesLabel: '分钟',
      faresTitle: 'Mexibús 票价',
      generalFareLabel: '普通单程票',
      cardFareLabel: 'Mexipase / Movimex 卡（含 1 次乘车）',
      transferTitle: 'Ojo de Agua 换乘',
      transferDescription: '同一线路使用同一张卡可免费换乘。换乘时请出示卡片。',
      estimateNote: '发车间隔和行程时间为估算值，可能因运营情况和时段而变化。请向运营方确认最新信息。此处未列出城郊铁路票价。',
      viewAirportMap: '放大 AIFA 地图',
      openImageLabel: '全屏查看图片',
      closeViewerLabel: '关闭图片查看器',
      zoomInLabel: '放大',
      zoomOutLabel: '缩小',
      resetZoomLabel: '重置缩放',
      gestureHint: '双指缩放 · 拖动平移 · 向下滑动关闭',
      stationDetails: {
        default: '位置：{station} 区域。换乘：请在现场查询可用的本地交通线路。附近：周边服务和商店；请确认开放时间及通行情况。',
        'ojo-de-agua': '位置：Ojo de Agua 车站，1号线换乘点。换乘：同一线路使用同一张卡可免费换乘。附近：本地服务和交通；请确认乘车地点。',
        'tecamac-centro': '位置：Tecámac 市中心。换乘：查询前往市中心和主广场的本地交通。附近：历史中心；前往 Sierra Hermosa 公园需乘坐本地交通，请确认路线。',
        'terminal-aifa': '位置：AIFA 旅客航站楼。换乘：航站楼入口、授权出租车、巴士和城郊铁路。附近：AIFA 文化长廊和博物馆；请确认开放时间及公众通行安排。',
        lecheria: '位置：Lechería 车站，与现有城郊铁路相连。换乘：墨西哥谷地铁路服务；请确认换乘方式和时刻表。',
        aifa: '位置：AIFA 机场区域车站。换乘：前往机场；请遵循官方指示前往航站楼。附近：文化长廊和博物馆；请确认开放时间及公众通行安排。'
      }
    },
    routeGallery: {
      title: 'Mexibús 至值机区路线',
      description: '按照图片顺序，从车站前往行李托运柜台。',
      steps: [
        { stage: 'Mexibús 车站', title: '抵达并从闸机离开', description: '在旅客航站楼站（终点站）下车，从出口闸机离开并继续前行。', referencePoint: '带凸起黄色条纹的触觉地面，提供视觉和触觉引导。', accessibilityNote: '起始路线全程设有触觉引导线。' },
        { stage: '换乘广场', title: '左转并通过人行横道', description: '向前行走12至15米后，沿触觉引导线左转。小心通过斑马线。', referencePoint: '照明路桩和带反光条的金属安全路桩。' },
        { stage: '停车场与列车区域', title: '沿柱廊通行（F至C）', description: '穿过停车场人行横道，右侧可见分区立柱。右侧前方是城郊铁路和巴士站的出入口。', referencePoint: '标有 D 和 F 字母的立柱及周边花盆。' },
        { stage: '航站楼入口', title: '从5号门进入（到达）', description: '经过 C、B、A 号立柱后稍向左转，从到达区5号门进入。', referencePoint: '天花板上悬挂着大型飞行翼龙雕塑。' },
        { stage: '前往出发层', title: '乘自动扶梯前往出发航班', description: '通过自动门后左转，乘坐标有“出发航班”的自动扶梯。', referencePoint: '扶梯入口处的“出发航班”标志。' },
        { stage: '值机区域', title: '抵达行李托运柜台', description: '上楼后右转，即可找到国内和国际航班的行李托运柜台。', referencePoint: '值机自助机和航空公司柜台。' }
      ]
    }
  }
};

type TranslationDictionary = {
  wifiHint: string;
  networkStatus: {
    online: string;
    offline: string;
  };
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
  details: DetailTranslations;
  survey: SurveyTranslations;
  videoCall: VideoCallTranslations;
  flightTime: FlightTimeTranslations;
  podotactile: PodotactileTranslations;
};

export const translations: Record<Language, TranslationDictionary> = {
  ES: {
    wifiHint: '¿Sin datos? Conéctate a la red Wi-Fi gratuita del aeropuerto: AIFA-Gratuito',
    networkStatus: { online: 'En línea', offline: 'Modo Offline' },
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
    },
    details: detailTranslations.ES,
    survey: surveyTranslations.ES,
    videoCall: {
      button: 'Asistencia Humana por Video',
      title: 'Asistencia Humana por Video',
      privacy: 'Se solicitarán permisos de cámara y micrófono. El video se transmite directamente entre dispositivos.',
      requestingPermissions: 'Solicitando permisos de cámara y micrófono...',
      calling: 'Llamando a Gestor de Servicio AIFA...',
      connected: 'Videollamada conectada',
      waiting: 'Esperando que el gestor acepte la llamada...',
      localVideoLabel: 'Tu cámara',
      remoteVideoLabel: 'Gestor de Servicio AIFA',
      endCall: 'Finalizar videollamada',
      permissionError: 'No se pudo acceder a la cámara o al micrófono. Revisa los permisos del navegador y vuelve a intentarlo.',
      connectionError: 'No fue posible conectar con el gestor. Comprueba tu conexión a internet e inténtalo de nuevo.',
      ratingTitle: 'Califica la atención recibida',
      ratingPrompt: '¿Cómo fue tu experiencia con el gestor?',
      commentLabel: 'Comentario (opcional)',
      commentPlaceholder: 'Cuéntanos cómo podemos mejorar...',
      submitRating: 'Guardar evaluación',
      close: 'Cerrar',
      ratingRequired: 'Selecciona una calificación de 1 a 5 estrellas.',
      thanks: 'Gracias. Tu evaluación quedó guardada en este dispositivo.',
      managerTitle: 'Consola de videollamadas AIFA',
      managerDescription: 'Mantén esta pantalla abierta para recibir solicitudes de asistencia por video.',
      managerOnline: 'Consola conectada; lista para recibir llamadas.',
      managerOffline: 'Conectando con el servicio de llamadas...',
      activateAlerts: 'Activar alertas sonoras',
      waitingForCalls: 'Esperando llamadas de pasajeros',
      incomingCall: 'Llamada entrante de un pasajero',
      acceptCall: 'Aceptar Videollamada',
      finishCall: 'Finalizar Llamada',
      callHistory: 'Bitácora de llamadas',
      noCallHistory: 'Aún no hay llamadas registradas.',
      durationLabel: 'Duración',
      dateLabel: 'Fecha',
      managementIdLabel: 'ID de gestión',
      ratingLabel: 'Calificación',
      soundAlert: 'Alerta sonora activada',
      peerIdError: 'No se pudo abrir la consola de llamadas. El ID del gestor puede estar ocupado.',
    },
    flightTime: flightTimeTranslations.ES,
    podotactile: podotactileTranslations.ES
  },
  EN: {
    wifiHint: 'No data? Connect to the airport’s free Wi-Fi network: AIFA-Gratuito',
    networkStatus: { online: 'Online', offline: 'Offline mode' },
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
    },
    details: detailTranslations.EN,
    survey: surveyTranslations.EN,
    videoCall: {
      button: 'Live Video Assistance',
      title: 'Live Video Assistance',
      privacy: 'Camera and microphone access will be requested. Video is streamed directly between devices.',
      requestingPermissions: 'Requesting camera and microphone access...',
      calling: 'Calling the AIFA Service Manager...',
      connected: 'Video call connected',
      waiting: 'Waiting for the manager to accept the call...',
      localVideoLabel: 'Your camera',
      remoteVideoLabel: 'AIFA Service Manager',
      endCall: 'End video call',
      permissionError: 'Could not access your camera or microphone. Check browser permissions and try again.',
      connectionError: 'Could not connect to the manager. Check your internet connection and try again.',
      ratingTitle: 'Rate the assistance you received',
      ratingPrompt: 'How was your experience with the manager?',
      commentLabel: 'Comment (optional)',
      commentPlaceholder: 'Tell us how we can improve...',
      submitRating: 'Save rating',
      close: 'Close',
      ratingRequired: 'Select a rating from 1 to 5 stars.',
      thanks: 'Thank you. Your rating was saved on this device.',
      managerTitle: 'AIFA video call console',
      managerDescription: 'Keep this screen open to receive video assistance requests.',
      managerOnline: 'Console connected; ready to receive calls.',
      managerOffline: 'Connecting to the call service...',
      activateAlerts: 'Enable sound alerts',
      waitingForCalls: 'Waiting for passenger calls',
      incomingCall: 'Incoming passenger call',
      acceptCall: 'Accept video call',
      finishCall: 'End call',
      callHistory: 'Call log',
      noCallHistory: 'No calls have been recorded yet.',
      durationLabel: 'Duration',
      dateLabel: 'Date',
      managementIdLabel: 'Management ID',
      ratingLabel: 'Rating',
      soundAlert: 'Sound alert enabled',
      peerIdError: 'Could not open the call console. The manager ID may already be in use.',
    },
    flightTime: flightTimeTranslations.EN,
    podotactile: podotactileTranslations.EN
  },
  FR: {
    wifiHint: 'Pas de données ? Connectez-vous au Wi-Fi gratuit de l’aéroport : AIFA-Gratuito',
    networkStatus: { online: 'En ligne', offline: 'Mode hors ligne' },
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
    },
    details: detailTranslations.FR,
    survey: surveyTranslations.FR,
    videoCall: {
      button: 'Assistance humaine en vidéo',
      title: 'Assistance humaine en vidéo',
      privacy: 'L’accès à la caméra et au microphone sera demandé. La vidéo est transmise directement entre les appareils.',
      requestingPermissions: 'Demande d’accès à la caméra et au microphone...',
      calling: 'Appel du responsable de service AIFA...',
      connected: 'Appel vidéo connecté',
      waiting: 'En attente de l’acceptation du responsable...',
      localVideoLabel: 'Votre caméra',
      remoteVideoLabel: 'Responsable de service AIFA',
      endCall: 'Terminer l’appel vidéo',
      permissionError: 'Impossible d’accéder à la caméra ou au microphone. Vérifiez les autorisations du navigateur et réessayez.',
      connectionError: 'Impossible de joindre le responsable. Vérifiez votre connexion Internet et réessayez.',
      ratingTitle: 'Évaluez l’assistance reçue',
      ratingPrompt: 'Comment s’est passée votre expérience avec le responsable ?',
      commentLabel: 'Commentaire (facultatif)',
      commentPlaceholder: 'Dites-nous comment nous améliorer...',
      submitRating: 'Enregistrer l’évaluation',
      close: 'Fermer',
      ratingRequired: 'Choisissez une note de 1 à 5 étoiles.',
      thanks: 'Merci. Votre évaluation a été enregistrée sur cet appareil.',
      managerTitle: 'Console d’appels vidéo AIFA',
      managerDescription: 'Gardez cet écran ouvert pour recevoir les demandes d’assistance vidéo.',
      managerOnline: 'Console connectée ; prête à recevoir des appels.',
      managerOffline: 'Connexion au service d’appels...',
      activateAlerts: 'Activer les alertes sonores',
      waitingForCalls: 'En attente des appels des passagers',
      incomingCall: 'Appel entrant d’un passager',
      acceptCall: 'Accepter l’appel vidéo',
      finishCall: 'Terminer l’appel',
      callHistory: 'Journal des appels',
      noCallHistory: 'Aucun appel enregistré pour le moment.',
      durationLabel: 'Durée',
      dateLabel: 'Date',
      managementIdLabel: 'ID de gestion',
      ratingLabel: 'Évaluation',
      soundAlert: 'Alerte sonore activée',
      peerIdError: 'Impossible d’ouvrir la console. L’identifiant du responsable est peut-être déjà utilisé.',
    },
    flightTime: flightTimeTranslations.FR,
    podotactile: podotactileTranslations.FR
  },
  ZH: {
    wifiHint: '没有流量？请连接机场免费 Wi-Fi：AIFA-Gratuito',
    networkStatus: { online: '在线', offline: '离线模式' },
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
    },
    details: detailTranslations.ZH,
    survey: surveyTranslations.ZH,
    videoCall: {
      button: '视频人工协助',
      title: '视频人工协助',
      privacy: '系统将请求使用摄像头和麦克风。视频将在设备之间直接传输。',
      requestingPermissions: '正在请求摄像头和麦克风权限...',
      calling: '正在呼叫 AIFA 服务管理员...',
      connected: '视频通话已连接',
      waiting: '正在等待管理员接听...',
      localVideoLabel: '您的摄像头',
      remoteVideoLabel: 'AIFA 服务管理员',
      endCall: '结束视频通话',
      permissionError: '无法访问摄像头或麦克风。请检查浏览器权限后重试。',
      connectionError: '无法连接管理员。请检查网络连接后重试。',
      ratingTitle: '请评价您获得的服务',
      ratingPrompt: '您对管理员的服务体验如何？',
      commentLabel: '评论（可选）',
      commentPlaceholder: '请告诉我们如何改进...',
      submitRating: '保存评价',
      close: '关闭',
      ratingRequired: '请选择 1 至 5 星。',
      thanks: '谢谢。您的评价已保存在此设备上。',
      managerTitle: 'AIFA 视频通话控制台',
      managerDescription: '请保持此页面打开，以接收旅客的视频协助请求。',
      managerOnline: '控制台已连接，等待来电。',
      managerOffline: '正在连接通话服务...',
      activateAlerts: '启用声音提醒',
      waitingForCalls: '正在等待旅客来电',
      incomingCall: '旅客来电',
      acceptCall: '接听视频通话',
      finishCall: '结束通话',
      callHistory: '通话记录',
      noCallHistory: '暂无通话记录。',
      durationLabel: '时长',
      dateLabel: '日期',
      managementIdLabel: '管理编号',
      ratingLabel: '评价',
      soundAlert: '声音提醒已启用',
      peerIdError: '无法打开通话控制台。管理员 ID 可能已被占用。',
    },
    flightTime: flightTimeTranslations.ZH,
    podotactile: podotactileTranslations.ZH
  }
};
