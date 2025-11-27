import { Topic } from '../types/medquiz';

// Complete Medical Topic Hierarchy
export const medicalTopics: Topic[] = [
  {
    id: 'medicine',
    name: 'Medicine',
    parentId: null,
    level: 0,
    questionCount: 1250,
    children: [
      {
        id: 'cardiology',
        name: 'Cardiology',
        parentId: 'medicine',
        level: 1,
        questionCount: 180,
        children: [
          { id: 'heart-failure', name: 'Heart Failure', parentId: 'cardiology', level: 2, questionCount: 45 },
          { id: 'arrhythmias', name: 'Arrhythmias', parentId: 'cardiology', level: 2, questionCount: 40 },
          { id: 'valvular-disease', name: 'Valvular Disease', parentId: 'cardiology', level: 2, questionCount: 35 },
          { id: 'coronary-artery-disease', name: 'Coronary Artery Disease', parentId: 'cardiology', level: 2, questionCount: 60 }
        ]
      },
      {
        id: 'pulmonology',
        name: 'Pulmonology',
        parentId: 'medicine',
        level: 1,
        questionCount: 160,
        children: [
          { id: 'copd-asthma', name: 'COPD & Asthma', parentId: 'pulmonology', level: 2, questionCount: 50 },
          { id: 'pneumonia', name: 'Pneumonia', parentId: 'pulmonology', level: 2, questionCount: 40 },
          { id: 'interstitial-lung-disease', name: 'Interstitial Lung Disease', parentId: 'pulmonology', level: 2, questionCount: 35 },
          { id: 'pulmonary-embolism', name: 'Pulmonary Embolism', parentId: 'pulmonology', level: 2, questionCount: 35 }
        ]
      },
      {
        id: 'gastroenterology',
        name: 'Gastroenterology',
        parentId: 'medicine',
        level: 1,
        questionCount: 170,
        children: [
          { id: 'inflammatory-bowel-disease', name: 'Inflammatory Bowel Disease', parentId: 'gastroenterology', level: 2, questionCount: 45 },
          { id: 'liver-disease', name: 'Liver Disease', parentId: 'gastroenterology', level: 2, questionCount: 60 },
          { id: 'gi-bleeding', name: 'GI Bleeding', parentId: 'gastroenterology', level: 2, questionCount: 40 },
          { id: 'peptic-ulcer-disease', name: 'Peptic Ulcer Disease', parentId: 'gastroenterology', level: 2, questionCount: 25 }
        ]
      },
      {
        id: 'nephrology',
        name: 'Nephrology',
        parentId: 'medicine',
        level: 1,
        questionCount: 140,
        children: [
          { id: 'acute-kidney-injury', name: 'Acute Kidney Injury', parentId: 'nephrology', level: 2, questionCount: 40 },
          { id: 'chronic-kidney-disease', name: 'Chronic Kidney Disease', parentId: 'nephrology', level: 2, questionCount: 45 },
          { id: 'glomerular-disease', name: 'Glomerular Disease', parentId: 'nephrology', level: 2, questionCount: 35 },
          { id: 'electrolyte-disorders', name: 'Electrolyte Disorders', parentId: 'nephrology', level: 2, questionCount: 20 }
        ]
      },
      {
        id: 'endocrinology',
        name: 'Endocrinology',
        parentId: 'medicine',
        level: 1,
        questionCount: 150,
        children: [
          { id: 'diabetes', name: 'Diabetes Mellitus', parentId: 'endocrinology', level: 2, questionCount: 60 },
          { id: 'thyroid-disorders', name: 'Thyroid Disorders', parentId: 'endocrinology', level: 2, questionCount: 45 },
          { id: 'adrenal-disorders', name: 'Adrenal Disorders', parentId: 'endocrinology', level: 2, questionCount: 25 },
          { id: 'pituitary-disorders', name: 'Pituitary Disorders', parentId: 'endocrinology', level: 2, questionCount: 20 }
        ]
      },
      {
        id: 'hematology',
        name: 'Hematology',
        parentId: 'medicine',
        level: 1,
        questionCount: 130,
        children: [
          { id: 'anemia', name: 'Anemia', parentId: 'hematology', level: 2, questionCount: 50 },
          { id: 'coagulation-disorders', name: 'Coagulation Disorders', parentId: 'hematology', level: 2, questionCount: 40 },
          { id: 'hematologic-malignancies', name: 'Hematologic Malignancies', parentId: 'hematology', level: 2, questionCount: 40 }
        ]
      },
      {
        id: 'infectious-disease',
        name: 'Infectious Disease',
        parentId: 'medicine',
        level: 1,
        questionCount: 190,
        children: [
          { id: 'hiv-aids', name: 'HIV/AIDS', parentId: 'infectious-disease', level: 2, questionCount: 50 },
          { id: 'sepsis', name: 'Sepsis', parentId: 'infectious-disease', level: 2, questionCount: 40 },
          { id: 'tuberculosis', name: 'Tuberculosis', parentId: 'infectious-disease', level: 2, questionCount: 35 },
          { id: 'stis', name: 'Sexually Transmitted Infections', parentId: 'infectious-disease', level: 2, questionCount: 35 },
          { id: 'antibiotics', name: 'Antibiotic Therapy', parentId: 'infectious-disease', level: 2, questionCount: 30 }
        ]
      },
      {
        id: 'rheumatology',
        name: 'Rheumatology',
        parentId: 'medicine',
        level: 1,
        questionCount: 130,
        children: [
          { id: 'rheumatoid-arthritis', name: 'Rheumatoid Arthritis', parentId: 'rheumatology', level: 2, questionCount: 35 },
          { id: 'lupus', name: 'Systemic Lupus Erythematosus', parentId: 'rheumatology', level: 2, questionCount: 40 },
          { id: 'vasculitis', name: 'Vasculitis', parentId: 'rheumatology', level: 2, questionCount: 30 },
          { id: 'osteoarthritis', name: 'Osteoarthritis', parentId: 'rheumatology', level: 2, questionCount: 25 }
        ]
      }
    ]
  },
  {
    id: 'surgery',
    name: 'Surgery',
    parentId: null,
    level: 0,
    questionCount: 850,
    children: [
      {
        id: 'general-surgery',
        name: 'General Surgery',
        parentId: 'surgery',
        level: 1,
        questionCount: 200,
        children: [
          { id: 'acute-abdomen', name: 'Acute Abdomen', parentId: 'general-surgery', level: 2, questionCount: 50 },
          { id: 'hernias', name: 'Hernias', parentId: 'general-surgery', level: 2, questionCount: 40 },
          { id: 'appendicitis', name: 'Appendicitis', parentId: 'general-surgery', level: 2, questionCount: 30 },
          { id: 'cholecystitis', name: 'Cholecystitis', parentId: 'general-surgery', level: 2, questionCount: 35 },
          { id: 'bowel-obstruction', name: 'Bowel Obstruction', parentId: 'general-surgery', level: 2, questionCount: 45 }
        ]
      },
      {
        id: 'trauma',
        name: 'Trauma',
        parentId: 'surgery',
        level: 1,
        questionCount: 150,
        children: [
          { id: 'atls', name: 'ATLS Protocols', parentId: 'trauma', level: 2, questionCount: 50 },
          { id: 'head-trauma', name: 'Head Trauma', parentId: 'trauma', level: 2, questionCount: 45 },
          { id: 'abdominal-trauma', name: 'Abdominal Trauma', parentId: 'trauma', level: 2, questionCount: 35 },
          { id: 'chest-trauma', name: 'Chest Trauma', parentId: 'trauma', level: 2, questionCount: 20 }
        ]
      },
      {
        id: 'orthopedics',
        name: 'Orthopedics',
        parentId: 'surgery',
        level: 1,
        questionCount: 180,
        children: [
          { id: 'fractures', name: 'Fractures', parentId: 'orthopedics', level: 2, questionCount: 80 },
          { id: 'sports-medicine', name: 'Sports Medicine', parentId: 'orthopedics', level: 2, questionCount: 50 },
          { id: 'spine', name: 'Spine', parentId: 'orthopedics', level: 2, questionCount: 50 }
        ]
      },
      {
        id: 'neurosurgery',
        name: 'Neurosurgery',
        parentId: 'surgery',
        level: 1,
        questionCount: 120,
        children: [
          { id: 'intracranial-hemorrhage', name: 'Intracranial Hemorrhage', parentId: 'neurosurgery', level: 2, questionCount: 50 },
          { id: 'brain-tumors', name: 'Brain Tumors', parentId: 'neurosurgery', level: 2, questionCount: 40 },
          { id: 'hydrocephalus', name: 'Hydrocephalus', parentId: 'neurosurgery', level: 2, questionCount: 30 }
        ]
      },
      {
        id: 'vascular-surgery',
        name: 'Vascular Surgery',
        parentId: 'surgery',
        level: 1,
        questionCount: 100,
        children: [
          { id: 'aortic-aneurysm', name: 'Aortic Aneurysm', parentId: 'vascular-surgery', level: 2, questionCount: 40 },
          { id: 'peripheral-vascular-disease', name: 'Peripheral Vascular Disease', parentId: 'vascular-surgery', level: 2, questionCount: 35 },
          { id: 'carotid-disease', name: 'Carotid Disease', parentId: 'vascular-surgery', level: 2, questionCount: 25 }
        ]
      },
      {
        id: 'urology',
        name: 'Urology',
        parentId: 'surgery',
        level: 1,
        questionCount: 100,
        children: [
          { id: 'urinary-tract-infections', name: 'Urinary Tract Infections', parentId: 'urology', level: 2, questionCount: 30 },
          { id: 'kidney-stones', name: 'Kidney Stones', parentId: 'urology', level: 2, questionCount: 35 },
          { id: 'prostate-disease', name: 'Prostate Disease', parentId: 'urology', level: 2, questionCount: 35 }
        ]
      }
    ]
  },
  {
    id: 'pediatrics',
    name: 'Pediatrics',
    parentId: null,
    level: 0,
    questionCount: 650,
    children: [
      {
        id: 'general-pediatrics',
        name: 'General Pediatrics',
        parentId: 'pediatrics',
        level: 1,
        questionCount: 150,
        children: [
          { id: 'growth-development', name: 'Growth & Development', parentId: 'general-pediatrics', level: 2, questionCount: 40 },
          { id: 'well-child-visits', name: 'Well-Child Visits', parentId: 'general-pediatrics', level: 2, questionCount: 35 },
          { id: 'vaccines', name: 'Vaccines', parentId: 'general-pediatrics', level: 2, questionCount: 40 },
          { id: 'pediatric-nutrition', name: 'Pediatric Nutrition', parentId: 'general-pediatrics', level: 2, questionCount: 35 }
        ]
      },
      {
        id: 'neonatology',
        name: 'Neonatology',
        parentId: 'pediatrics',
        level: 1,
        questionCount: 120,
        children: [
          { id: 'neonatal-resuscitation', name: 'Neonatal Resuscitation', parentId: 'neonatology', level: 2, questionCount: 30 },
          { id: 'prematurity', name: 'Prematurity', parentId: 'neonatology', level: 2, questionCount: 45 },
          { id: 'neonatal-infections', name: 'Neonatal Infections', parentId: 'neonatology', level: 2, questionCount: 45 }
        ]
      },
      {
        id: 'pediatric-cardiology',
        name: 'Pediatric Cardiology',
        parentId: 'pediatrics',
        level: 1,
        questionCount: 100,
        children: [
          { id: 'congenital-heart-disease', name: 'Congenital Heart Disease', parentId: 'pediatric-cardiology', level: 2, questionCount: 70 },
          { id: 'kawasaki-disease', name: 'Kawasaki Disease', parentId: 'pediatric-cardiology', level: 2, questionCount: 30 }
        ]
      },
      {
        id: 'pediatric-infectious-disease',
        name: 'Pediatric Infectious Disease',
        parentId: 'pediatrics',
        level: 1,
        questionCount: 130,
        children: [
          { id: 'childhood-infections', name: 'Common Childhood Infections', parentId: 'pediatric-infectious-disease', level: 2, questionCount: 60 },
          { id: 'meningitis', name: 'Meningitis', parentId: 'pediatric-infectious-disease', level: 2, questionCount: 40 },
          { id: 'pediatric-hiv', name: 'Pediatric HIV', parentId: 'pediatric-infectious-disease', level: 2, questionCount: 30 }
        ]
      },
      {
        id: 'pediatric-emergency',
        name: 'Pediatric Emergency',
        parentId: 'pediatrics',
        level: 1,
        questionCount: 150,
        children: [
          { id: 'pediatric-respiratory-emergencies', name: 'Respiratory Emergencies', parentId: 'pediatric-emergency', level: 2, questionCount: 50 },
          { id: 'pediatric-trauma', name: 'Pediatric Trauma', parentId: 'pediatric-emergency', level: 2, questionCount: 45 },
          { id: 'child-abuse', name: 'Child Abuse', parentId: 'pediatric-emergency', level: 2, questionCount: 30 },
          { id: 'poisoning', name: 'Poisoning', parentId: 'pediatric-emergency', level: 2, questionCount: 25 }
        ]
      }
    ]
  },
  {
    id: 'obgyn',
    name: 'Obstetrics & Gynecology',
    parentId: null,
    level: 0,
    questionCount: 550,
    children: [
      {
        id: 'obstetrics',
        name: 'Obstetrics',
        parentId: 'obgyn',
        level: 1,
        questionCount: 280,
        children: [
          { id: 'prenatal-care', name: 'Prenatal Care', parentId: 'obstetrics', level: 2, questionCount: 60 },
          { id: 'high-risk-pregnancy', name: 'High-Risk Pregnancy', parentId: 'obstetrics', level: 2, questionCount: 70 },
          { id: 'labor-delivery', name: 'Labor & Delivery', parentId: 'obstetrics', level: 2, questionCount: 80 },
          { id: 'postpartum', name: 'Postpartum Care', parentId: 'obstetrics', level: 2, questionCount: 40 },
          { id: 'complications-pregnancy', name: 'Complications of Pregnancy', parentId: 'obstetrics', level: 2, questionCount: 30 }
        ]
      },
      {
        id: 'gynecology',
        name: 'Gynecology',
        parentId: 'obgyn',
        level: 1,
        questionCount: 270,
        children: [
          { id: 'menstrual-disorders', name: 'Menstrual Disorders', parentId: 'gynecology', level: 2, questionCount: 50 },
          { id: 'contraception', name: 'Contraception', parentId: 'gynecology', level: 2, questionCount: 45 },
          { id: 'infertility', name: 'Infertility', parentId: 'gynecology', level: 2, questionCount: 40 },
          { id: 'menopause', name: 'Menopause', parentId: 'gynecology', level: 2, questionCount: 35 },
          { id: 'gynecologic-oncology', name: 'Gynecologic Oncology', parentId: 'gynecology', level: 2, questionCount: 50 },
          { id: 'pelvic-inflammatory-disease', name: 'Pelvic Inflammatory Disease', parentId: 'gynecology', level: 2, questionCount: 30 },
          { id: 'endometriosis', name: 'Endometriosis', parentId: 'gynecology', level: 2, questionCount: 20 }
        ]
      }
    ]
  },
  {
    id: 'psychiatry',
    name: 'Psychiatry',
    parentId: null,
    level: 0,
    questionCount: 420,
    children: [
      {
        id: 'mood-disorders',
        name: 'Mood Disorders',
        parentId: 'psychiatry',
        level: 1,
        questionCount: 100,
        children: [
          { id: 'major-depression', name: 'Major Depressive Disorder', parentId: 'mood-disorders', level: 2, questionCount: 50 },
          { id: 'bipolar-disorder', name: 'Bipolar Disorder', parentId: 'mood-disorders', level: 2, questionCount: 50 }
        ]
      },
      {
        id: 'anxiety-disorders',
        name: 'Anxiety Disorders',
        parentId: 'psychiatry',
        level: 1,
        questionCount: 80,
        children: [
          { id: 'generalized-anxiety', name: 'Generalized Anxiety Disorder', parentId: 'anxiety-disorders', level: 2, questionCount: 30 },
          { id: 'panic-disorder', name: 'Panic Disorder', parentId: 'anxiety-disorders', level: 2, questionCount: 25 },
          { id: 'ptsd', name: 'PTSD', parentId: 'anxiety-disorders', level: 2, questionCount: 25 }
        ]
      },
      {
        id: 'psychotic-disorders',
        name: 'Psychotic Disorders',
        parentId: 'psychiatry',
        level: 1,
        questionCount: 90,
        children: [
          { id: 'schizophrenia', name: 'Schizophrenia', parentId: 'psychotic-disorders', level: 2, questionCount: 60 },
          { id: 'schizoaffective', name: 'Schizoaffective Disorder', parentId: 'psychotic-disorders', level: 2, questionCount: 30 }
        ]
      },
      {
        id: 'substance-use',
        name: 'Substance Use Disorders',
        parentId: 'psychiatry',
        level: 1,
        questionCount: 80,
        children: [
          { id: 'alcohol-use', name: 'Alcohol Use Disorder', parentId: 'substance-use', level: 2, questionCount: 40 },
          { id: 'opioid-use', name: 'Opioid Use Disorder', parentId: 'substance-use', level: 2, questionCount: 40 }
        ]
      },
      {
        id: 'personality-disorders',
        name: 'Personality Disorders',
        parentId: 'psychiatry',
        level: 1,
        questionCount: 70,
        children: [
          { id: 'borderline-personality', name: 'Borderline Personality Disorder', parentId: 'personality-disorders', level: 2, questionCount: 35 },
          { id: 'antisocial-personality', name: 'Antisocial Personality Disorder', parentId: 'personality-disorders', level: 2, questionCount: 35 }
        ]
      }
    ]
  },
  {
    id: 'neurology',
    name: 'Neurology',
    parentId: null,
    level: 0,
    questionCount: 380,
    children: [
      {
        id: 'stroke',
        name: 'Stroke',
        parentId: 'neurology',
        level: 1,
        questionCount: 80,
        children: [
          { id: 'ischemic-stroke', name: 'Ischemic Stroke', parentId: 'stroke', level: 2, questionCount: 50 },
          { id: 'hemorrhagic-stroke', name: 'Hemorrhagic Stroke', parentId: 'stroke', level: 2, questionCount: 30 }
        ]
      },
      {
        id: 'seizures-epilepsy',
        name: 'Seizures & Epilepsy',
        parentId: 'neurology',
        level: 1,
        questionCount: 90,
        children: [
          { id: 'seizure-types', name: 'Seizure Types', parentId: 'seizures-epilepsy', level: 2, questionCount: 45 },
          { id: 'epilepsy-management', name: 'Epilepsy Management', parentId: 'seizures-epilepsy', level: 2, questionCount: 45 }
        ]
      },
      {
        id: 'movement-disorders',
        name: 'Movement Disorders',
        parentId: 'neurology',
        level: 1,
        questionCount: 70,
        children: [
          { id: 'parkinsons', name: "Parkinson's Disease", parentId: 'movement-disorders', level: 2, questionCount: 40 },
          { id: 'essential-tremor', name: 'Essential Tremor', parentId: 'movement-disorders', level: 2, questionCount: 30 }
        ]
      },
      {
        id: 'dementia',
        name: 'Dementia',
        parentId: 'neurology',
        level: 1,
        questionCount: 70,
        children: [
          { id: 'alzheimers', name: "Alzheimer's Disease", parentId: 'dementia', level: 2, questionCount: 45 },
          { id: 'vascular-dementia', name: 'Vascular Dementia', parentId: 'dementia', level: 2, questionCount: 25 }
        ]
      },
      {
        id: 'headache',
        name: 'Headache',
        parentId: 'neurology',
        level: 1,
        questionCount: 70,
        children: [
          { id: 'migraine', name: 'Migraine', parentId: 'headache', level: 2, questionCount: 40 },
          { id: 'cluster-headache', name: 'Cluster Headache', parentId: 'headache', level: 2, questionCount: 30 }
        ]
      }
    ]
  },
  {
    id: 'emergency-medicine',
    name: 'Emergency Medicine',
    parentId: null,
    level: 0,
    questionCount: 450,
    children: [
      {
        id: 'resuscitation',
        name: 'Resuscitation',
        parentId: 'emergency-medicine',
        level: 1,
        questionCount: 100,
        children: [
          { id: 'acls', name: 'ACLS', parentId: 'resuscitation', level: 2, questionCount: 50 },
          { id: 'shock', name: 'Shock', parentId: 'resuscitation', level: 2, questionCount: 50 }
        ]
      },
      {
        id: 'toxicology',
        name: 'Toxicology',
        parentId: 'emergency-medicine',
        level: 1,
        questionCount: 100,
        children: [
          { id: 'overdose', name: 'Overdose Management', parentId: 'toxicology', level: 2, questionCount: 60 },
          { id: 'antidotes', name: 'Antidotes', parentId: 'toxicology', level: 2, questionCount: 40 }
        ]
      },
      {
        id: 'environmental-emergencies',
        name: 'Environmental Emergencies',
        parentId: 'emergency-medicine',
        level: 1,
        questionCount: 80,
        children: [
          { id: 'hypothermia', name: 'Hypothermia', parentId: 'environmental-emergencies', level: 2, questionCount: 25 },
          { id: 'heat-illness', name: 'Heat Illness', parentId: 'environmental-emergencies', level: 2, questionCount: 25 },
          { id: 'drowning', name: 'Drowning', parentId: 'environmental-emergencies', level: 2, questionCount: 30 }
        ]
      },
      {
        id: 'wound-management',
        name: 'Wound Management',
        parentId: 'emergency-medicine',
        level: 1,
        questionCount: 70,
        children: [
          { id: 'lacerations', name: 'Lacerations', parentId: 'wound-management', level: 2, questionCount: 40 },
          { id: 'burns', name: 'Burns', parentId: 'wound-management', level: 2, questionCount: 30 }
        ]
      },
      {
        id: 'emergency-procedures',
        name: 'Emergency Procedures',
        parentId: 'emergency-medicine',
        level: 1,
        questionCount: 100,
        children: [
          { id: 'airway-management', name: 'Airway Management', parentId: 'emergency-procedures', level: 2, questionCount: 50 },
          { id: 'chest-tube', name: 'Chest Tube', parentId: 'emergency-procedures', level: 2, questionCount: 30 },
          { id: 'central-line', name: 'Central Line', parentId: 'emergency-procedures', level: 2, questionCount: 20 }
        ]
      }
    ]
  },
  {
    id: 'wizari-exams',
    name: 'Wizari Step 2 CK Practice Exams',
    parentId: null,
    level: 0,
    questionCount: 800,
    children: [
      { id: 'wizari-exam-1', name: 'Practice Exam 1', parentId: 'wizari-exams', level: 1, questionCount: 200 },
      { id: 'wizari-exam-2', name: 'Practice Exam 2', parentId: 'wizari-exams', level: 1, questionCount: 200 },
      { id: 'wizari-exam-3', name: 'Practice Exam 3', parentId: 'wizari-exams', level: 1, questionCount: 200 },
      { id: 'wizari-exam-4', name: 'Practice Exam 4', parentId: 'wizari-exams', level: 1, questionCount: 200 }
    ]
  }
];

// Helper function to flatten topics for search
export function flattenTopics(topics: Topic[]): Topic[] {
  const result: Topic[] = [];
  
  function traverse(topic: Topic) {
    result.push(topic);
    if (topic.children) {
      topic.children.forEach(traverse);
    }
  }
  
  topics.forEach(traverse);
  return result;
}

// Helper function to find topic by ID
export function findTopicById(id: string, topics: Topic[] = medicalTopics): Topic | null {
  for (const topic of topics) {
    if (topic.id === id) return topic;
    if (topic.children) {
      const found = findTopicById(id, topic.children);
      if (found) return found;
    }
  }
  return null;
}

// Helper function to get breadcrumb trail
export function getBreadcrumbTrail(topicId: string): Topic[] {
  const trail: Topic[] = [];
  const allTopics = flattenTopics(medicalTopics);
  
  let currentTopic = allTopics.find(t => t.id === topicId);
  
  while (currentTopic) {
    trail.unshift(currentTopic);
    if (currentTopic.parentId) {
      currentTopic = allTopics.find(t => t.id === currentTopic!.parentId);
    } else {
      currentTopic = undefined;
    }
  }
  
  return trail;
}
