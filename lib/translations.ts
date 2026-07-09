// lib/translations.ts

export type Language = "en" | "hi";

export const translations = {
  en: {
    // General / Header
    logoName: "AstroLearn",
    masalaRemedies: "Masala Remedies",
    yantra: "Yantra",
    grahaRemedies: "Graha Remedies",
    disclaimer: "Disclaimer: AstroLearn remedies and talismans are traditional Vedic practices, provided for educational and cultural purposes. Not medical or financial advice.",
    back: "← Back",
    startOver: "Start Over ←",
    freeBadge: "Free Vedic Wisdom",

    // Home Page
    heroTitleLine1: "India’s Largest",
    heroTitleLine2: "Online",
    heroTitleLine3: "Astro-Learning Platform",
    heroSubtitle: "Unlock personalized astrological yantras and kitchen masala remedies derived from ancient scriptures. 100% self-hosted, no subscriptions.",
    selectEngine: "Select Your Vedic Engine",
    
    masalaCardTagline: "Kitchen Spice Formulas",
    masalaCardDesc: "Got money drain, relationship disputes, vastu defects, or poor health? Answer simple concern questions and get convenient spice remedies you can do straight from home.",
    masalaCardCTA: "Find My Remedy &rarr;",
    masalaCountText: "126+ remedies mapped",

    yantraCardTitle: "Personalized Yantra",
    yantraCardTagline: "Geometric Talisman Generator",
    yantraCardDesc: "Determine your custom geometrical Vedic talismans. Supports DOB-based Numeroscope grid analysis to spot missing numbers, plus manual planet selections. Render and print.",
    yantraCardCTA: "Find My Yantra &rarr;",
    yantraCountText: "56+ geometric grids",

    browseLibraries: "Or Browse Reference Libraries",
    grahaRemediesLink: "🪐 Graha Remedies Index",
    masalaCategoriesLink: "🌿 Masala Categories List",
    dailyHoroscopeLink: "🔮 Daily Horoscope Outlook",

    // Masala Funnel page
    masalaFunnelTitle: "Lal Kitab Masala Remedies Recommender",
    masalaFunnelDesc: "Find convenient spice-based Vedic remedies to dissolve real-life problems.",
    step1Title: "Step 1: Tell us your details",
    yourNameOptional: "Your Name (Optional)",
    nameHelper: "Used to customize some intentions. Leave blank to be referred to as \"Native\".",
    continueToCategories: "Continue to Categories",
    step2Title: "Step 2: Choose Life Area",
    step3Title: "Step 3: What specific issue are you facing?",
    recommendedRemedies: "Recommended Remedies",
    multipleOptionsSubtitle: "Multiple Options to Choose From",
    checkIngredients: "Check Ingredients at Home:",
    processSteps: "Process Steps:",
    intentionTitle: "Intention / Sankalpa Chant:",
    mantraChanting: "Mantra Chanting:",
    benefitsLabel: "Benefits:",
    importantGuidance: "⚠️ Important Guidance:",

    // Yantra Page
    yantraTitle: "Personalized Yantra",
    yantraDesc: "Generate Vedic yantras based on your life goals — or get precise recommendations from your Kundli birth chart.",
    byGoalBtn: "By Goal / Concern",
    byGoalBtnDesc: "Select your life area and concern",
    byKundliBtn: "By Kundli (Birth Chart)",
    byKundliBtnDesc: "Enter birth time & place for exact chart",
    byPlanetBtn: "Pick Planet",
    byPlanetBtnDesc: "Select a specific planetary yantra",
    
    // Yantra Goal Step 1
    yantraStep1Title: "Step 1: Your Details",
    yourNameRequired: "Your Name (Required)",
    nameTalismanHelper: "This name will be dynamically written inside name-based talismans.",
    planetaryAlignment: "Planetary Alignment (Optional)",
    noFocus: "No Focus",
    dobCheck: "DOB Check",
    pickPlanet: "Pick Planet",
    dobLabel: "Date of Birth",
    dobHelper: "Calculates missing numbers in your numeroscope grid.",
    selectPlanetFocus: "Select Planet Focus",
    continueToGoals: "Continue to Goals →",

    // Yantra Goal Step 2
    yantraStep2Title: "Step 2: Area of Life",
    yantraStep3Title: "Step 3: Specific Concern",

    // Yantra Step 4 / Results
    yourRecommendedTalisman: "Your Recommended Talisman",
    numeroscopeInsights: "🪐 Numeroscope Insights",
    missingGridNumbers: "Missing grid numbers:",
    goalYantraRecommended: "Goal Yantra (Recommended)",
    planetFocusToggle: "🪐 Planet Focus Toggle",
    goalYantra: "Goal Yantra",
    planetYantraLabel: "Planet:",
    customizeTalismanContent: "Customize Talisman Content",
    destinationName: "Destination Name",
    businessName: "Business Name",
    nameOnTalisman: "Name on Talisman",
    preparationDay: "Day:",
    preparationTime: "Time:",
    preparationMaterials: "Materials:",

    // Yantra Kundli Step 1
    enterBirthDetails: "Enter Your Birth Details",
    birthDetailsHelper: "Your Kundli (birth chart) will be calculated using Vedic Jyotish — Lahiri Ayanamsha, Whole Sign houses.",
    dobRequired: "Date of Birth *",
    tobRequired: "Time of Birth *",
    tobHelper: "Birth time is essential to calculate the correct Lagna (Ascendant / rising sign).",
    pobRequired: "Place of Birth *",
    pobHelper: "City name is geocoded via OpenStreetMap to get latitude & longitude for Lagna calculation.",
    calculateBtn: "🔭 Calculate My Kundli & Recommend Yantras",
    calculatingText: "Calculating Kundli...",

    // Yantra Kundli Step 2
    kundliAnalysis: "Kundli Analysis",
    birthChartTitle: "Birth Chart",
    lagnaLabel: "Lagna (Ascendant)",
    ayanamshaLabel: "Ayanamsha",
    navagrahaPositions: "Navagraha Positions",
    noWeakPlanets: "No severely afflicted planets found in your chart.",
    noWeakPlanetsDesc: "Your planetary positions appear relatively balanced. You may still use the Goal-based flow to select specific intention yantras.",
    afflictedPlanetsDetected: "Afflicted Planet Detected",
    afflictedPlanetsDetectedPlural: "Afflicted Planets Detected",
    whyPlanetQuestion: "Why",
    remedyStrongLabel: "Remedy:",
    remedyText: "Energize the active yantra to pacify and strengthen this planet."
  },
  hi: {
    // General / Header
    logoName: "एस्ट्रोलर्न",
    masalaRemedies: "मसाला उपाय",
    yantra: "यंत्र",
    grahaRemedies: "ग्रह उपाय",
    disclaimer: "अस्वीकरण: एस्ट्रोलर्न के उपाय और यंत्र पारंपरिक वैदिक प्रथाएं हैं, जो शैक्षिक और सांस्कृतिक उद्देश्यों के लिए प्रदान की जाती हैं। कोई चिकित्सा या वित्तीय सलाह नहीं।",
    back: "← पीछे",
    startOver: "फिर से शुरू करें ←",
    freeBadge: "मुफ़्त वैदिक ज्ञान",

    // Home Page
    heroTitleLine1: "भारत का सबसे बड़ा",
    heroTitleLine2: "ऑनलाइन",
    heroTitleLine3: "एस्ट्रो-लर्निंग प्लेटफॉर्म",
    heroSubtitle: "प्राचीन शास्त्रों से प्राप्त व्यक्तिगत ज्योतिषीय यंत्र और रसोई मसाला उपचार अनलॉक करें। 100% स्व-होस्टेड, कोई सब्सक्रिप्शन नहीं।",
    selectEngine: "अपना वैदिक इंजन चुनें",

    masalaCardTagline: "रसोई मसाला सूत्र",
    masalaCardDesc: "क्या आपका पैसा बह रहा है, रिश्तों में विवाद है, वास्तु दोष है या स्वास्थ्य खराब है? आसान सवालों के जवाब दें और अपने घर पर ही किए जाने वाले आसान मसाला उपाय प्राप्त करें।",
    masalaCardCTA: "मेरा उपाय खोजें &rarr;",
    masalaCountText: "126+ उपाय उपलब्ध हैं",

    yantraCardTitle: "व्यक्तिगत यंत्र",
    yantraCardTagline: "ज्यामितीय तावीज जनरेटर",
    yantraCardDesc: "अपने कस्टम ज्यामितीय वैदिक तावीज निर्धारित करें। लापता संख्याओं को खोजने के लिए जन्म तिथि आधारित न्यूमरोस्कोप ग्रिड विश्लेषण, और मैन्युअल ग्रह चयनों का समर्थन करता है।",
    yantraCardCTA: "मेरा यंत्र खोजें &rarr;",
    yantraCountText: "56+ ज्यामितीय ग्रिड",

    browseLibraries: "या संदर्भ पुस्तकालयों को ब्राउज़ करें",
    grahaRemediesLink: "🪐 ग्रह उपाय सूचकांक",
    masalaCategoriesLink: "🌿 मसाला श्रेणियां सूची",
    dailyHoroscopeLink: "🔮 दैनिक राशिफल आउटलुक",

    // Masala Funnel page
    masalaFunnelTitle: "लाल किताब मसाला उपाय रेकमेंडर",
    masalaFunnelDesc: "वास्तविक जीवन की समस्याओं को दूर करने के लिए आसान मसाला-आधारित वैदिक उपाय खोजें।",
    step1Title: "चरण 1: हमें अपना विवरण बताएं",
    yourNameOptional: "आपका नाम (वैकल्पिक)",
    nameHelper: "कुछ संकल्पों को अनुकूलित करने के लिए उपयोग किया जाता है। यदि खाली छोड़ते हैं तो \"जातक\" कहा जाएगा।",
    continueToCategories: "श्रेणियों पर आगे बढ़ें",
    step2Title: "चरण 2: जीवन का क्षेत्र चुनें",
    step3Title: "चरण 3: आप किस विशिष्ट समस्या का सामना कर रहे हैं?",
    recommendedRemedies: "अनुशंसित उपाय",
    multipleOptionsSubtitle: "चुनने के लिए कई विकल्प",
    checkIngredients: "घर पर सामग्री की जांच करें:",
    processSteps: "उपाय करने की विधि:",
    intentionTitle: "संकल्प / प्रार्थना मंत्र:",
    mantraChanting: "मंत्र जाप:",
    benefitsLabel: "लाभ:",
    importantGuidance: "⚠️ महत्वपूर्ण निर्देश:",

    // Yantra Page
    yantraTitle: "व्यक्तिगत यंत्र",
    yantraDesc: "अपने जीवन लक्ष्यों के आधार पर वैदिक यंत्र उत्पन्न करें — या अपने कुंडली जन्म चार्ट से सटीक सिफारिशें प्राप्त करें।",
    byGoalBtn: "लक्ष्य / चिंता द्वारा",
    byGoalBtnDesc: "अपने जीवन क्षेत्र और चिंता का चयन करें",
    byKundliBtn: "कुंडली (जन्म चार्ट) द्वारा",
    byKundliBtnDesc: "सटीक चार्ट के लिए जन्म समय और स्थान दर्ज करें",
    byPlanetBtn: "ग्रह चुनें",
    byPlanetBtnDesc: "एक विशिष्ट ग्रह यंत्र का चयन करें",

    // Yantra Goal Step 1
    yantraStep1Title: "चरण 1: आपका विवरण",
    yourNameRequired: "आपका नाम (आवश्यक)",
    nameTalismanHelper: "यह नाम गतिशील रूप से नाम-आधारित तावीज के भीतर लिखा जाएगा।",
    planetaryAlignment: "ग्रह संरेखण (वैकल्पिक)",
    noFocus: "कोई ध्यान नहीं",
    dobCheck: "जन्मतिथि जांच",
    pickPlanet: "ग्रह चुनें",
    dobLabel: "जन्मतिथि",
    dobHelper: "आपके न्यूमरोस्कोप ग्रिड में लापता नंबरों की गणना करता है।",
    selectPlanetFocus: "ग्रह फोकस चुनें",
    continueToGoals: "लक्ष्यों पर आगे बढ़ें →",

    // Yantra Goal Step 2
    yantraStep2Title: "चरण 2: जीवन का क्षेत्र",
    yantraStep3Title: "चरण 3: विशिष्ट चिंता",

    // Yantra Step 4 / Results
    yourRecommendedTalisman: "आपका अनुशंसित तावीज",
    numeroscopeInsights: "🪐 न्यूमरोस्कोप अंतर्दृष्टि",
    missingGridNumbers: "लापता ग्रिड नंबर:",
    goalYantraRecommended: "लक्ष्य यंत्र (अनुशंसित)",
    planetFocusToggle: "🪐 ग्रह फोकस टॉगल",
    goalYantra: "लक्ष्य यंत्र",
    planetYantraLabel: "ग्रह:",
    customizeTalismanContent: "तावीज सामग्री अनुकूलित करें",
    destinationName: "गंतव्य नाम",
    businessName: "व्यवसाय नाम",
    nameOnTalisman: "तावीज पर नाम",
    preparationDay: "दिन:",
    preparationTime: "समय:",
    preparationMaterials: "सामग्री:",

    // Yantra Kundli Step 1
    enterBirthDetails: "अपने जन्म का विवरण दर्ज करें",
    birthDetailsHelper: "आपकी कुंडली की गणना वैदिक ज्योतिष — लाहिड़ी अयनांश, पूर्ण राशि गृह प्रणाली का उपयोग करके की जाएगी।",
    dobRequired: "जन्मतिथि *",
    tobRequired: "जन्म समय *",
    tobHelper: "सही लग्न (उदय राशि) की गणना के लिए जन्म का समय आवश्यक है।",
    pobRequired: "जन्म स्थान *",
    pobHelper: "लग्न गणना के लिए अक्षांश और देशांतर प्राप्त करने के लिए शहर के नाम को ओपनस्ट्रीटमैप के माध्यम से भू-कोडित किया जाता है।",
    calculateBtn: "🔭 मेरी कुंडली की गणना करें और यंत्र सुझाएं",
    calculatingText: "कुंडली की गणना की जा रही है...",

    // Yantra Kundli Step 2
    kundliAnalysis: "कुंडली विश्लेषण",
    birthChartTitle: "जन्म कुंडली",
    lagnaLabel: "लग्न",
    ayanamshaLabel: "अयनांश",
    navagrahaPositions: "नवग्रह स्थिति",
    noWeakPlanets: "आपकी कुंडली में कोई गंभीर रूप से पीड़ित ग्रह नहीं पाया गया।",
    noWeakPlanetsDesc: "आपकी ग्रहों की स्थिति अपेक्षाकृत संतुलित दिखाई देती है। आप विशिष्ट यंत्रों का चयन करने के लिए लक्ष्य-आधारित प्रवाह का उपयोग कर सकते हैं।",
    afflictedPlanetsDetected: "पीड़ित ग्रह मिला",
    afflictedPlanetsDetectedPlural: "पीड़ित ग्रह मिले",
    whyPlanetQuestion: "क्यों",
    remedyStrongLabel: "उपाय:",
    remedyText: "इस ग्रह को शांत और मजबूत करने के लिए सक्रिय यंत्र को सक्रिय करें।"
  }
};
export type TranslationsDictionary = typeof translations.en;
