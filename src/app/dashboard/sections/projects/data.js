
// Mock Database
// Structure: Single Array of Categories, where each category contains its list of projects.
// Populated with REAL content from the company portfolio.

export const projectsData = [
  {
    id: "aramco",
    name_en: "Saudi Aramco Company",
    name_ar: "شركة أرامكو السعودية",
    projects: [
      {
        id: "aramco-1",
        image: "/images/our-projects/Saudi Aramco Compan/Development of the heavy industrial zone in the Jazan Economic Area.png",
        en: { title: "Development of the heavy industrial zone in the Jazan Economic Area", owner: "Saudi Aramco", location: "", duration: "", status: "Under Construction", value: "SR 88,367,400" },
        ar: { title: "تطوير المنطقة الصناعية الثقيلة في منطقة جازان الاقتصادية", owner: "أرامكو السعودية", location: "", duration: "", status: "قيد الإنشاء", value: "88,367,400 ريال" }
      },
      {
        id: "aramco-2",
        image: "/images/our-projects/Saudi Aramco Compan/Gas Collection Plant Road.jpg",
        en: { title: "Gas Collection Plant Road", owner: "Saudi Aramco", location: " Chiba", duration: "300 days", status: "Under construction", value: "SR 45,300,000" },
        ar: { title: "طريق محطة تجميع الغاز", owner: "أرامكو السعودية", location: "شيبة", duration: "300 يوم", status: "قيد الإنشاء", value: "45,300,000 ريال" }
      },
      {
        id: "aramco-3",
        image: "/images/our-projects/Saudi Aramco Compan/Infrastructure works for the Jazan Economic Zone.png",
        en: { title: "Infrastructure works for the Jazan Economic Zone", owner: "Saudi Aramco", location: "", duration: "", status: "Under Construction", value: "SR 323,145,280" },
        ar: { title: "أعمال البنية التحتية لمنطقة جازان الاقتصادية", owner: "أرامكو السعودية", location: "", duration: "", status: "قيد الإنشاء", value: "323,145,280 ريال" }
      },
      {
        id: "aramco-4",
        image: "/images/our-projects/Saudi Aramco Compan/Maintenance of main roads in the southern region.jpg",
        en: { title: "Maintenance of main roads in the southern region", owner: "Saudi Aramco", location: "Southern Region", duration: "5 years", status: "Under construction", value: "SAR 392,985,769" },
        ar: { title: "صيانة الطرق الرئيسية في المنطقة الجنوبية", owner: "أرامكو السعودية", location: "المنطقة الجنوبية", duration: "5 سنوات", status: "قيد الإنشاء", value: "392,985,769 ريال" }
      },
      {
        id: "aramco-5",
        image: "/images/our-projects/Saudi Aramco Compan/Site of Jizan refinery.jpg",
        en: { title: "Site of Jizan refinery", owner: "Saudi Aramco", location: "Jizan", duration: "368 days", status: "Under construction", value: "SR 245,360,850" },
        ar: { title: "موقع مصفاة جازان", owner: "أرامكو السعودية", location: "جازان", duration: "368 يوم", status: "قيد الإنشاء", value: "245,360,850 ريال" }
      },
      {
        id: "aramco-6",
        image: "/images/our-projects/Saudi Aramco Compan/Transportation of clay and cement materials.png",
        en: { title: "Transportation of clay and cement materials", owner: "Saudi Aramco", location: "Eastern Region", duration: "5 years", status: "Done", value: "SR 30,340,000" },
        ar: { title: "نقل مواد الطين والأسمنت", owner: "أرامكو السعودية", location: "المنطقة الشرقية", duration: "5 سنوات", status: "مكتمل", value: "30,340,000 ريال" }
      },
      {
        id: "aramco-7",
        image: "/images/our-projects/Saudi Aramco Compan/Transportation of materials, cement and clay.jpg",
        en: { title: "Transportation of materials, cement and clay", owner: "Saudi Aramco", location: "", duration: "5 years", status: "Under construction", value: "SR 30,660,000" },
        ar: { title: "نقل المواد والأسمنت والطين", owner: "أرامكو السعودية", location: "", duration: "5 سنوات", status: "قيد الإنشاء", value: "30,660,000 ريال" }
      }
    ]
  },
  {
    id: "dammamAirports",
    name_en: "Dammam Airports Company",
    name_ar: "شركة مطارات الدمام",
    projects: [
      {
        id: "dammam-1",
        image: "/images/our-projects/Dammam Airports Company/Infrastructure Development of the Air Cargo Village at King Fahd International Airport (Part A).png",
        en: { title: "Infrastructure Development of the Air Cargo Village at King Fahd International Airport (Part A)", owner: "Dammam Airports Company", location: "Dammam", duration: "39.5 months", status: "in progress", value: "88,697,116.00 SAR" },
        ar: { title: "تطوير البنية التحتية لقرية الشحن الجوي بمطار الملك فهد الدولي (الجزء أ)", owner: "شركة مطارات الدمام", location: "الدمام", duration: "39.5 شهر", status: "قيد التنفيذ", value: "88,697,116.00 ريال" }
      },
      {
        id: "dammam-2",
        image: "/images/our-projects/Dammam Airports Company/Infrastructure Development of the Air Cargo Village at King Fahd International Airport (Part B).png",
        en: { title: "Infrastructure Development of the Air Cargo Village at King Fahd International Airport (Part B)", owner: "Dammam Airports Company", location: "Dammam", duration: "22.3 months", status: "in progress", value: "40,054,161.41 SAR" },
        ar: { title: "تطوير البنية التحتية لقرية الشحن الجوي بمطار الملك فهد الدولي (الجزء ب)", owner: "شركة مطارات الدمام", location: "الدمام", duration: "22.3 شهر", status: "قيد التنفيذ", value: "40,054,161.41 ريال" }
      }
    ]
  },
  {
    id: "railways",
    name_en: "General Authority for Railways",
    name_ar: "الهيئة العامة للسكك الحديدية",
    projects: [
      {
        id: "railways-1",
        image: "/images/our-projects/General Authority for Railways/Construction of a concrete bridge (41-42) km on the double railway line 1-2.jpg",
        en: { title: "Construction of a concrete bridge (41-42) km on the double railway line 1-2", owner: "Railways General Authority", location: "", duration: "", status: "Under Construction", value: "SR 14,158,622" },
        ar: { title: "إنشاء جسر خرساني (41-42) كم على خط السكة الحديد المزدوج 1-2", owner: "الهيئة العامة للسكك الحديدية", location: "", duration: "", status: "قيد الإنشاء", value: "14,158,622 ريال" }
      },
      {
        id: "railways-2",
        image: "/images/our-projects/General Authority for Railways/Construction of a concrete bridge 196 km on the railway line.jpg",
        en: { title: "Construction of a concrete bridge 196 km on the railway line", owner: "Railways General Authority", location: "", duration: "", status: "Completed", value: "SR 17,725,385" },
        ar: { title: "إنشاء جسر خرساني 196 كم على خط السكة الحديد", owner: "الهيئة العامة للسكك الحديدية", location: "", duration: "", status: "مكتمل", value: "17,725,385 ريال" }
      },
      {
        id: "railways-3",
        image: "/images/our-projects/General Authority for Railways/Modification of the soil shoulders for the iron line No. (1) between Al-Hofuf and Riyadh.jpg",
        en: { title: "Modification of the soil shoulders for the iron line No. (1) between Al-Hofuf and Riyadh", owner: "Railways General Authority", location: "", duration: "", status: "Under Construction", value: " SR 28.696.678.74" },
        ar: { title: "تعديل أكتاف التربة للخط الحديدي رقم (1) بين الهفوف والرياض", owner: "الهيئة العامة للسكك الحديدية", location: "", duration: "", status: "قيد الإنشاء", value: "28,696,678.74 ريال" }
      }
    ]
  },
  {
    id: "industrialCities",
    name_en: "Industrial Cities Authority",
    name_ar: "هيئة المدن الصناعية",
    projects: [
      {
        id: "industrial-1",
        image: "/images/our-projects/Industrial Cities Authority/Completion of the roads development in the second industrial city in Dammam.jpg",
        en: { title: "Completion of the roads development in the second industrial city in Dammam", owner: "Saudi Industrial Property Authority “MODON”", location: "", duration: "", status: "Under Construction", value: "SR 43,969,703.10" },
        ar: { title: "استكمال تطوير الطرق في المدينة الصناعية الثانية بالدمام", owner: "الهيئة السعودية للمدن الصناعية \"مدن\"", location: "", duration: "", status: "قيد الإنشاء", value: "43,969,703.10 ريال" }
      },
      {
        id: "industrial-2",
        image: "/images/our-projects/Industrial Cities Authority/Development of Oasis cities in Yanbu.jpg",
        en: { title: "Development of Oasis cities in Yanbu", owner: "Saudi Industrial Property Authority “MODON”", location: "", duration: "", status: "Under Construction", value: "SR 47,812,668.16" },
        ar: { title: "تطوير مدن الواحات في ينبع", owner: "الهيئة السعودية للمدن الصناعية \"مدن\"", location: "", duration: "", status: "قيد الإنشاء", value: "47,812,668.16 ريال" }
      },
      {
        id: "industrial-3",
        image: "/images/our-projects/Industrial Cities Authority/Development of building material zone in Sudair city for the industry & business.jpg",
        en: { title: "Development of building material zone in Sudair city for the industry & business", owner: "Saudi Industrial Property Authority “MODON”", location: "", duration: "", status: "Under Construction", value: "SR 210,271,351" },
        ar: { title: "تطوير منطقة مواد البناء بمدينة سدير للصناعة والأعمال", owner: "الهيئة السعودية للمدن الصناعية \"مدن\"", location: "", duration: "", status: "قيد الإنشاء", value: "210,271,351 ريال" }
      },
      {
        id: "industrial-4",
        image: "/images/our-projects/Industrial Cities Authority/Development of the Second Industrial City in Al-Hasa.png",
        en: { title: "Development of the Second Industrial City in Al-Hasa", owner: "Saudi Industrial Property Authority “MODON”", location: "Al– Ahsa – Hofuf", duration: "", status: "Under Construction", value: "SR 65,000,000" },
        ar: { title: "تطوير المدينة الصناعية الثانية بالأحساء", owner: "الهيئة السعودية للمدن الصناعية \"مدن\"", location: "الأحساء - الهفوف", duration: "", status: "قيد الإنشاء", value: "65,000,000 ريال" }
      },
      {
        id: "industrial-5",
        image: "/images/our-projects/Industrial Cities Authority/Infrastructure implementation project in the second industrial city in Aseer Contract No-2490.png",
        en: { title: "Infrastructure implementation project in the second industrial city in Aseer Contract No-2490", owner: "Saudi Industrial Property Authority “MODON”", location: "", duration: "36 Months", status: "In progress", value: "SR 193,838,477.50" },
        ar: { title: "مشروع تنفيذ البنية التحتية بالمدينة الصناعية الثانية بعسير عقد رقم-2490", owner: "الهيئة السعودية للمدن الصناعية \"مدن\"", location: "", duration: "36 شهر", status: "قيد التنفيذ", value: "193,838,477.50 ريال" }
      },
      {
        id: "industrial-6",
        image: "/images/our-projects/Industrial Cities Authority/Link services and facilities between the second and third industrial cities in Jeddah–Contract No.-2459.png",
        en: { title: "Link services and facilities between the second and third industrial cities in Jeddah–Contract No.-2459", owner: "Saudi Industrial Property Authority “MODON”", location: "", duration: "36 months", status: "In progress", value: "SR 173,583,751.1" },
        ar: { title: "ربط الخدمات والمرافق بين المدينتين الصناعيتين الثانية والثالثة بجدة – عقد رقم-2459", owner: "الهيئة السعودية للمدن الصناعية \"مدن\"", location: "", duration: "36 شهر", status: "قيد التنفيذ", value: "173,583,751.1 ريال" }
      }
    ]
  },
  {
    id: "municipalRural",
    name_en: "Ministry of Municipal and Rural Affairs",
    name_ar: "وزارة الشؤون البلدية والقروية",
    projects: [
      {
        id: "municipal-1",
        image: "/images/our-projects/Ministry of Municipal and Rural Affairs/CONSTRUCTION OF THE KING ABDULLAH CULTURAL CENTER.png",
        en: { title: "CONSTRUCTION OF THE KING ABDULLAH CULTURAL CENTER", owner: "Ministry of Municipal and Rural Affairs  – Al Ahsa Secretariat", location: "Al- Ahsa", duration: "", status: "Done", value: "SR 61,195,000" },
        ar: { title: "إنشاء مركز الملك عبدالله الثقافي", owner: "وزارة الشؤون البلدية والقروية - أمانة الأحساء", location: "الأحساء", duration: "", status: "مكتمل", value: "61,195,000 ريال" }
      },
      {
        id: "municipal-2",
        image: "/images/our-projects/Ministry of Municipal and Rural Affairs/KING FAHAD INTERCHANGE – KING ABDULAZIZ ROAD.jpg",
        en: { title: "KING FAHAD INTERCHANGE – KING ABDULAZIZ ROAD", owner: "Ministry of Municipal and Rural Affairs  – Al Ahsa Secretariat", location: "Hofuf – Secretariat of Ahsa", duration: "", status: "Finished", value: "SR 59,584,220.00" },
        ar: { title: "تقاطع الملك فهد – طريق الملك عبدالعزيز", owner: "وزارة الشؤون البلدية والقروية - أمانة الأحساء", location: "الهفوف - أمانة الأحساء", duration: "", status: "مكتمل", value: "59,584,220.00 ريال" }
      }
    ]
  },
  {
    id: "transportation",
    name_en: "Ministry of Transport",
    name_ar: "وزارة النقل",
    projects: [
      {
        id: "transport-1",
        image: "/images/our-projects/Ministry of The Transportation/Al-Hofuf Road-Al-Aqeer in the Eastern Region.jpg",
        en: { title: "Al-Hofuf Road-Al-Aqeer in the Eastern Region", owner: "Ministry of Transport", location: "Eastern Region", duration: "36 months", status: "Done", value: " SAR 55,000,000.00" },
        ar: { title: "طريق الهفوف-العقير بالمنطقة الشرقية", owner: "وزارة النقل", location: "المنطقة الشرقية", duration: "36 شهر", status: "مكتمل", value: "55,000,000.00 ريال" }
      },
      {
        id: "transport-2",
        image: "/images/our-projects/Ministry of The Transportation/Completion of the Ring Road in Al-Hasa, Southern, Eastern and Northern Shr.jpg",
        en: { title: "Completion of the Ring Road in Al-Hasa, Southern, Eastern and Northern Shr", owner: "Ministry of Transport ", location: " Al Ahsa ring road", duration: "36 months", status: "Done", value: " 219.999.992.00 SAR" },
        ar: { title: "استكمال الطريق الدائري بالأحساء الجنوبي والشرقي والشمالي", owner: "وزارة النقل", location: "طريق الأحساء الدائري", duration: "36 شهر", status: "مكتمل", value: "219,999,992.00 ريال" }
      },
      {
        id: "transport-3",
        image: "/images/our-projects/Ministry of The Transportation/Completion of the Riyadh-Khurais road duplication in the Riyadh region.png",
        en: { title: "Completion of the Riyadh-Khurais road duplication in the Riyadh region", owner: "Ministry of Transport", location: "Riyadh", duration: "47.5 months", status: "in progress", value: " 94,999,999.50 SAR" },
        ar: { title: "استكمال ازدواج طريق الرياض-خريص بمنطقة الرياض", owner: "وزارة النقل", location: "الرياض", duration: "47.5 شهر", status: "قيد التنفيذ", value: "94,999,999.50 ريال" }
      },
      {
        id: "transport-4",
        image: "/images/our-projects/Ministry of The Transportation/Completion of the intersections of Al-Ahsa Abqaiq-Dhahran -Abu Hadriyah in the Eastern Province.png",
        en: { title: "Completion of the intersections of Al-Ahsa Abqaiq-Dhahran -Abu Hadriyah in the Eastern Province", owner: "Ministry of Transport", location: "Al Ahsa", duration: "24.3 months", status: "in progress", value: " 122,443,611.68 SAR" },
        ar: { title: "استكمال تقاطعات الأحساء بقيق-الظهران -أبو حدرية بالمنطقة الشرقية", owner: "وزارة النقل", location: "الأحساء", duration: "24.3 شهر", status: "قيد التنفيذ", value: "122,443,611.68 ريال" }
      },
      {
        id: "transport-5",
        image: "/images/our-projects/Ministry of The Transportation/Construction of a road from King Khalid Military City to Daghileeb Al-Wajaan intersection in the Eastern Province.png",
        en: { title: "Construction of a road from King Khalid Military City to Daghileeb Al-Wajaan intersection in the Eastern Province", owner: "Ministry of Transport ", location: " Eastern Province ", duration: "39.8 months", status: "in progress", value: " 197,336,358.45 SAR" },
        ar: { title: "إنشاء طريق من مدينة الملك خالد العسكرية إلى تقاطع دغيليب الوجعان بالمنطقة الشرقية", owner: "وزارة النقل", location: "المنطقة الشرقية", duration: "39.8 شهر", status: "قيد التنفيذ", value: "197,336,358.45 ريال" }
      },
      {
        id: "transport-6",
        image: "/images/our-projects/Ministry of The Transportation/Double Hafof-Salwa.jpg",
        en: { title: "Double Hafof-Salwa", owner: "Ministry of Transport", location: "Double Hofuf / Salwa", duration: "36 months", status: "Done", value: " 69,999.999.00 SAR" },
        ar: { title: "ازدواج الهفوف-سلوى", owner: "وزارة النقل", location: "ازدواج الهفوف / سلوى", duration: "36 شهر", status: "مكتمل", value: "69,999,999.00 ريال" }
      },
      {
        id: "transport-7",
        image: "/images/our-projects/Ministry of The Transportation/Maintenance of Dhahran-Abqaiq-Hofuf-Khurais road performance, Contract No. (203).png",
        en: { title: "Maintenance of Dhahran-Abqaiq-Hofuf-Khurais road performance, Contract No. (203)", owner: "", location: "", duration: "36 months", status: "In progress", value: " SR 73,869,102.20" },
        ar: { title: "صيانة أداء طريق الظهران-بقيق-الهفوف-خريص، عقد رقم (203)", owner: "", location: "", duration: "36 شهر", status: "قيد التنفيذ", value: "73,869,102.20 ريال" }
      },
      {
        id: "transport-8",
        image: "/images/our-projects/Ministry of The Transportation/Maintenance of the performance of the roads of Riyadh – Khurais – Sudair, Contract No. (111).png",
        en: { title: "Maintenance of the performance of the roads of Riyadh – Khurais – Sudair, Contract No. (111)", owner: "", location: "", duration: "36 months", status: "In progress ", value: " SR 101,300,945.01" },
        ar: { title: "صيانة أداء طريق الرياض – خريص – سدير، عقد رقم (111)", owner: "", location: "", duration: "36 شهر", status: "قيد التنفيذ", value: "101,300,945.01 ريال" }
      },
      {
        id: "transport-9",
        image: "/images/our-projects/Ministry of The Transportation/Roads and Transport Administration Branch Building in Al-Ahsa Governorate.png",
        en: { title: "Roads and Transport Administration Branch Building in Al-Ahsa Governorate", owner: "Ministry of Transport", location: "Al Ahsa", duration: "49.8 months", status: "in progress ", value: " 9,999,957.00 SAR" },
        ar: { title: "مبنى فرع إدارة الطرق والنقل بمحافظة الأحساء", owner: "وزارة النقل", location: "الأحساء", duration: "49.8 شهر", status: "قيد التنفيذ", value: "9,999,957.00 ريال" }
      },
      {
        id: "transport-10",
        image: "/images/our-projects/Ministry of The Transportation/The implementation of a bridge at the intersection of the road Albuibat with the road Althamama.jpg",
        en: { title: "The implementation of a bridge at the intersection of the road Albuibat with the road Althamama", owner: "Ministry of Transport ", location: "Tramway", duration: " 8 months", status: "Done ", value: " SR 53,272,000.00" },
        ar: { title: "تنفيذ جسر عند تقاطع طريق البويب مع طريق الثمامة", owner: "وزارة النقل", location: "تراموي", duration: "8 أشهر", status: "مكتمل", value: "53,272,000.00 ريال" }
      }
    ]
  },
  {
    id: "waterElectricity",
    name_en: "Ministry of Water and Electricity",
    name_ar: "وزارة المياه والكهرباء",
    projects: [
      {
        id: "water-1",
        image: "/images/our-projects/Ministry of Water and Electricity/Establishing drinking water networks in Buraidah city – Phase III.jpg",
        en: { title: "Establishing drinking water networks in Buraidah city – Phase III", owner: "Ministry of Water and Electricity", location: "Al- Ahsa", duration: "", status: "Under construction", value: "SR 74,473,325" },
        ar: { title: "إنشاء شبكات مياه الشرب بمدينة بريدة – المرحلة الثالثة", owner: "وزارة المياه والكهرباء", location: "الأحساء", duration: "", status: "قيد الإنشاء", value: "74,473,325 ريال" }
      },
      {
        id: "water-2",
        image: "/images/our-projects/Ministry of Water and Electricity/Sewage treatment plant capacity of 3000 m3 -day and the main pumping station and the expulsion line surplus in the province of Samta Jazan.jpg",
        en: { title: "Sewage treatment plant capacity of 3000 m3 -day and the main pumping station...", owner: "Ministry of Water and Electricity", location: "Jazan", duration: "", status: "Under construction", value: "SR 107,545,417" },
        ar: { title: "محطة معالجة مياه الصرف الصحي سعة 3000 م3/يوم ومحطة الضخ الرئيسية...", owner: "وزارة المياه والكهرباء", location: "جازان", duration: "", status: "قيد الإنشاء", value: "107,545,417 ريال" }
      },
      {
        id: "water-3",
        image: "/images/our-projects/Ministry of Water and Electricity/Water line project to connect the desalination tank with the reserve in the desalination tank in Naaman city in Abha city.jpg",
        en: { title: "Water line project to connect the desalination tank with the reserve...", owner: "Ministry of Water and Electricity", location: "Abha", duration: "", status: "Done", value: "SR 18,285,155" },
        ar: { title: "مشروع خط المياه لربط خزان التحلية بالاحتياطي...", owner: "وزارة المياه والكهرباء", location: "أبها", duration: "", status: "مكتمل", value: "18,285,155 ريال" }
      }
    ]
  },
  {
    id: "housing",
    name_en: "Ministry of Housing",
    name_ar: "وزارة الإسكان",
    projects: [
      {
        id: "housing-1",
        image: "/images/our-projects/Ministry of housing/Abdu Arish Housing – Jazan.png",
        en: { title: "Abdu Arish Housing – Jazan", owner: "Ministry of Housing", location: "Eastern Region", duration: "", status: "Completed", value: " SR 87,778,027.68"  },
        ar: { title: "إسكان أبو عريش – جازان", owner: "وزارة الإسكان", location: "المنطقة الشرقية", duration: "", status: "مكتمل", value: "87,778,027.68 ريال" }
      },
      {
        id: "housing-2",
        image: "/images/our-projects/Ministry of housing/Al-Kharj Housing “Preliminary Works”.jpg",
        en: { title: "Al-Kharj Housing “Preliminary Works”", owner: "Ministry of Housing", location: "Al-Kharj housing", duration: "", status: "Done", value: " SR 61,360,000" },
        ar: { title: "إسكان الخرج \"أعمال أولية\"", owner: "وزارة الإسكان", location: "إسكان الخرج", duration: "", status: "مكتمل", value: "61,360,000 ريال" }
      },
      {
        id: "housing-3",
        image: "/images/our-projects/Ministry of housing/Biesh Housing – Jazan.png",
        en: { title: "Biesh Housing – Jazan", owner: "Ministry of Housing", location: "Eastern Region", duration: "", status: "Completed", value: " SR 80,548,212" },
        ar: { title: "إسكان بيش – جازان", owner: "وزارة الإسكان", location: "المنطقة الشرقية", duration: "", status: "مكتمل", value: "80,548,212 ريال" }
      },
      {
        id: "housing-4",
        image: "/images/our-projects/Ministry of housing/Housing of King Abdullah Suburb – Jazan.png",
        en: { title: "Housing of King Abdullah Suburb – Jazan", owner: "Ministry of Housing", location: "Eastern Region", duration: "", status: "Under Construction", value: " SR 276,381,907.96" },
        ar: { title: "إسكان ضاحية الملك عبدالله – جازان", owner: "وزارة الإسكان", location: "المنطقة الشرقية", duration: "", status: "قيد الإنشاء", value: "276,381,907.96 ريال" }
      },
      {
        id: "housing-5",
        image: "/images/our-projects/Ministry of housing/Housing project in the area of Al Baha.jpg",
        en: { title: "Housing project in the area of Al Baha", owner: "Ministry of Housing", location: "Nawan – Jazan", duration: "", status: "Completed", value: " SR 69,600,000" },
        ar: { title: "مشروع الإسكان بمنطقة الباحة", owner: "وزارة الإسكان", location: "ناوان - جازان", duration: "", status: "مكتمل", value: "69,600,000 ريال" }
      },
      {
        id: "housing-6",
        image: "/images/our-projects/Ministry of housing/Riyadh Airport King Khalid Hotel – Riyadh.jpg",
        en: { title: "Riyadh Airport King Khalid Hotel – Riyadh", owner: "Ministry of Housing", location: "Riyadh ", duration: "", status: "Done", value: " SR 146,476,280" },
        ar: { title: "فندق مطار الملك خالد بالرياض – الرياض", owner: "وزارة الإسكان", location: "الرياض", duration: "", status: "مكتمل", value: "146,476,280 ريال" }
      },
      {
        id: "housing-7",
        image: "/images/our-projects/Ministry of housing/Sabiyah Housing – Jazan.png",
        en: { title: "Sabiyah Housing – Jazan", owner: " Ministry of Housing", location: " ", duration: " ", status: "Completed", value: " SR 79,767,376.60" },
        ar: { title: "إسكان صبيا – جازان", owner: "وزارة الإسكان", location: "", duration: "", status: "مكتمل", value: "79,767,376.60 ريال" }
      },
      {
        id: "housing-8",
        image: "/images/our-projects/Ministry of housing/Samtah Housing – Jazan.png",
        en: { title: "Samtah Housing – Jazan", owner: "Ministry of Housing", location: " ", duration: " ", status: "Completed", value: " SR 63,339,656.35" },
        ar: { title: "إسكان صامطة – جازان", owner: "وزارة الإسكان", location: "", duration: "", status: "مكتمل", value: "63,339,656.35 ريال" }
      }
    ]
  },
  {
    id: "nationalHousing",
    name_en: "National Housing Company",
    name_ar: "الوطنية للإسكان",
    projects: [
      {
        id: "national-1",
        image: "/images/our-projects/National Housing Company/Implementation of the developmental housing project, King Abdulaziz Road – 1782 housing units – Medina.png",
        en: { title: "Implementation of the developmental housing project, King Abdulaziz Road – 1782 housing units – Medina", owner: "National Housing Company", location: "", duration: "18 months", status: " In progress", value: "590,788,600" },
        ar: { title: "تنفيذ مشروع الإسكان التنموي طريق الملك عبدالعزيز – 1782 وحدة سكنية – المدينة المنورة", owner: "الشركة الوطنية للإسكان", location: "", duration: "18 شهر", status: "قيد التنفيذ", value: "590,788,600 ريال" }
      },
      {
        id: "national-2",
        image: "/images/our-projects/National Housing Company/Implementation of the infrastructure for the site of Forsan Gumah in Jazan.png",
        en: { title: "Implementation of the infrastructure for the site of Forsan Gumah in Jazan", owner: "National Housing Company", location: "Forsan Gumah in Jazan", duration: "33.2 Months", status: "Completed", value: "SR 99,561,287.73" },
        ar: { title: "تنفيذ البنية التحتية لموقع فرسان جمعة بجازان", owner: "الشركة الوطنية للإسكان", location: "فرسان جمعة بجازان", duration: "33.2 شهر", status: "مكتمل", value: "99,561,287.73 ريال" }
      }
    ]
  },
  {
    id: "qiddiya",
    name_en: "Qiddiya Investment Company",
    name_ar: "شركة القدية للاستثمار",
    projects: [
      {
        id: "qiddiya-1",
        image: "/images/our-projects/Qiddiya Investment Company/Comprehensive settlement of the main resort area and the city center of Qiddiya–Contract No.-QMPO-400-CT-00001.png",
        en: { title: "Comprehensive settlement of the main resort area and the city center of Qiddiya", owner: "Qiddiya", location: "Riyadh", duration: "26.2 Months", status: "Completed", value: "SR 249,794,890.29" },
        ar: { title: "التسوية الشاملة لمنطقة المنتجع الرئيسية ووسط مدينة القدية", owner: "القدية", location: "الرياض", duration: "26.2 شهر", status: "مكتمل", value: "249,794,890.29 ريال" }
      },
      {
        id: "qiddiya-2",
        image: "/images/our-projects/Qiddiya Investment Company/Service Road for the Upper Plateau of Qiddiya City – Contract No. QMPO-410-CT-00630.png",
        en: { title: "Service Road for the Upper Plateau of Qiddiya City", owner: "Qiddiya", location: "Riyadh", duration: "13.1 Months", status: "Completed", value: "SR 41,895,000.00" },
        ar: { title: "طريق الخدمة للهضبة العليا لمدينة القدية", owner: "القدية", location: "الرياض", duration: "13.1 شهر", status: "مكتمل", value: "41,895,000.00 ريال" }
      },
      {
        id: "qiddiya-3",
        image: "/images/our-projects/Qiddiya Investment Company/Settlement works project for the Six Flags Buildings for Qiddiya Investment Company – Contract No.- QPMO-410-CT-01498.png",
        en: { title: "Settlement works project for the Six Flags Buildings for Qiddiya Investment Company", owner: "Qiddiya Investment Company", location: "Riyadh", duration: "3 months", status: "Executed", value: "24,802,471.83 SAR" },
        ar: { title: "مشروع أعمال التسوية لمباني سيكس فلاجز لشركة القدية للاستثمار", owner: "شركة القدية للاستثمار", location: "الرياض", duration: "3 أشهر", status: "مكتمل", value: "24,802,471.83 ريال" }
      }
    ]
  },
  {
    id: "royalCommission",
    name_en: "Royal Commission for Jubail and Yanbu",
    name_ar: "الهيئة الملكية للجبيل وينبع",
    projects: [
      {
        id: "royal-1",
        image: "/images/our-projects/Royal Commission for Jubail and Yanbu/MAINTENANCE OF THE ROADS OF YANBU CITY – PHASE NINE – YANBU INDUSTRIAL CITY.jpg",
        en: { title: "MAINTENANCE OF THE ROADS OF YANBU CITY – PHASE NINE – YANBU INDUSTRIAL CITY", owner: "Royal Commission for Jubail & Yanbu", location: "Yanbu", duration: "", status: "Under construction", value: "SR 59,990,587.00" },
        ar: { title: "صيانة طرق مدينة ينبع – المرحلة التاسعة – مدينة ينبع الصناعية", owner: "الهيئة الملكية للجبيل وينبع", location: "ينبع", duration: "", status: "قيد الإنشاء", value: "59,990,587.00 ريال" }
      }
    ]
  },
  {
    id: "borderGuards",
    name_en: "The Guards Of The Border",
    name_ar: "حرس الحدود",
    projects: [
      {
        id: "border-1",
        image: "/images/our-projects/The Guards Of The Border/Operation, maintenance and cleanliness for the patrolling of the Border Guard in the sectors of (Al-Khafji-Hafr Al-Batin) – the Eastern Region No. (2).jpg",
        en: { title: "Operation, maintenance and cleanliness for the patrolling of the Border Guard in the sectors of (Al-Khafji-Hafr Al-Batin) – the Eastern Region No. (2)", owner: "Border Guard", location: "", duration: "", status: "Under construction", value: " SR 21,522,310" },
        ar: { title: "تشغيل وصيانة ونظافة لـدوريات حرس الحدود في قطاعات (الخفجي - حفر الباطن) – المنطقة الشرقية رقم (2)", owner: "حرس الحدود", location: "", duration: "", status: "قيد الإنشاء", value: "21,522,310 ريال" }
      },
      {
        id: "border-2",
        image: "/images/our-projects/The Guards Of The Border/Road construction of the for the border patrolling (Al-Matif – Kharkhir) – Sharurah.png",
        en: { title: "Road construction of the for the border patrolling (Al-Matif – Kharkhir) – Sharurah", owner: "Border Guard", location: "", duration: "", status: "Under construction", value: "SR 597,150,000" },
        ar: { title: "إنشاء طريق لدوريات الحدود (المطيف – الخرخير) – شرورة", owner: "حرس الحدود", location: "", duration: "", status: "قيد الإنشاء", value: "597,150,000 ريال" }
      }
    ]
  },
  {
    id: "miskCity",
    name_en: "The Miskcity Company",
    name_ar: "شركة مدينة مسك",
    projects: [
      {
        id: "misk-1",
        image: "/images/our-projects/The Miskcity Commpany/The preliminary works of the Misk Al-Mishraq city project.png",
        en: { title: "The preliminary works of the Misk Al-Mishraq city project", owner: "Misk Company ", location: "Riyadh", duration: "21.6 months", status: "in progress ", value: " 43,232,369.38 SAR" },
        ar: { title: "الأعمال الأولية لمشروع مدينة مسك المشراق", owner: "شركة مسك", location: "الرياض", duration: "21.6 شهر", status: "قيد التنفيذ", value: "43,232,369.38 ريال" }
      }
    ]
  }
];
