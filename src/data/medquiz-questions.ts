import { Question } from '../types/medquiz';

// Sample questions for demonstration
export const sampleQuestions: Question[] = [
  // Heart Failure Questions
  {
    id: 'hf-001',
    topicId: 'heart-failure',
    question: 'A 68-year-old man with a history of myocardial infarction presents with progressive dyspnea on exertion, orthopnea, and bilateral lower extremity edema. Physical examination reveals jugular venous distention, bilateral crackles, and an S3 gallop. Which medication has been shown to reduce mortality in patients with systolic heart failure?',
    options: [
      'Furosemide',
      'Digoxin',
      'Lisinopril',
      'Hydralazine alone',
      'Nifedipine'
    ],
    correctAnswer: 2,
    explanation: 'ACE inhibitors (such as lisinopril) have been definitively shown to reduce mortality in patients with systolic heart failure. They work by blocking the renin-angiotensin-aldosterone system, reducing afterload, and preventing cardiac remodeling. While furosemide is important for symptom management, it has not been shown to reduce mortality. Digoxin improves symptoms but does not reduce mortality. Beta-blockers (not listed) also reduce mortality. Hydralazine combined with nitrates can reduce mortality in African American patients, but hydralazine alone does not.',
    optionExplanations: [
      'Furosemide is a loop diuretic that improves symptoms by reducing volume overload, but has NOT been shown to reduce mortality in heart failure. It only provides symptomatic relief.',
      'Digoxin can improve symptoms and reduce hospitalizations but does NOT reduce mortality in heart failure patients. The DIG trial showed no mortality benefit.',
      'CORRECT: ACE inhibitors like lisinopril reduce mortality by ~20% in systolic heart failure by blocking RAAS, reducing afterload, and preventing cardiac remodeling.',
      'Hydralazine alone does NOT reduce mortality. However, the combination of hydralazine + isosorbide dinitrate does reduce mortality specifically in African American patients (A-HeFT trial).',
      'Nifedipine and other dihydropyridine calcium channel blockers are generally avoided in HFrEF as they can worsen heart failure due to negative inotropic effects and do NOT reduce mortality.'
    ],
    difficulty: 'medium',
    tags: ['heart-failure', 'pharmacology', 'cardiology'],
    category: 'Cardiology'
  },
  {
    id: 'hf-002',
    topicId: 'heart-failure',
    question: 'A 72-year-old woman with heart failure with reduced ejection fraction (HFrEF) on optimal medical therapy continues to have NYHA Class III symptoms. Her medications include carvedilol, lisinopril, spironolactone, and furosemide. What additional therapy should be considered?',
    options: [
      'Increase furosemide dose',
      'Add amlodipine',
      'Cardiac resynchronization therapy',
      'Add diltiazem',
      'Switch to hydrochlorothiazide'
    ],
    correctAnswer: 2,
    explanation: 'Cardiac resynchronization therapy (CRT) should be considered in patients with HFrEF who remain symptomatic despite optimal medical therapy, have LVEF ≤35%, sinus rhythm, and QRS duration ≥150 ms with LBBB morphology. CRT improves symptoms, quality of life, and reduces hospitalizations and mortality. Simply increasing the diuretic dose addresses symptoms but not the underlying problem. Calcium channel blockers like amlodipine and diltiazem are generally avoided in HFrEF as they can worsen heart failure.',
    difficulty: 'hard',
    tags: ['heart-failure', 'device-therapy', 'cardiology']
  },
  {
    id: 'hf-003',
    topicId: 'heart-failure',
    question: 'A 55-year-old man presents with acute decompensated heart failure. He is hypotensive with BP 85/50 mmHg, tachycardic, and in respiratory distress. He has cool extremities and altered mental status. What is the most appropriate initial management?',
    options: [
      'IV furosemide',
      'IV nitroglycerin',
      'Inotropic support with dobutamine',
      'Oral metoprolol',
      'IV enalaprilat'
    ],
    correctAnswer: 2,
    explanation: 'This patient has cardiogenic shock (hypoperfusion with hypotension, cool extremities, and altered mental status). Inotropic support with dobutamine or milrinone is indicated to improve cardiac output and end-organ perfusion. Diuretics and vasodilators would worsen hypotension. Beta-blockers are contraindicated in cardiogenic shock. Once hemodynamically stable, mechanical circulatory support or transplant evaluation may be needed.',
    difficulty: 'medium',
    tags: ['heart-failure', 'emergency', 'cardiology']
  },
  // Arrhythmia Questions
  {
    id: 'arr-001',
    topicId: 'arrhythmias',
    question: 'A 45-year-old woman presents to the ED with palpitations that started 2 hours ago. ECG shows atrial fibrillation with a ventricular rate of 140 bpm. She is hemodynamically stable. What is the most appropriate next step?',
    options: [
      'Immediate electrical cardioversion',
      'Rate control with diltiazem and anticoagulation',
      'Adenosine 6 mg IV push',
      'Amiodarone loading',
      'Observation only'
    ],
    correctAnswer: 1,
    explanation: 'For hemodynamically stable atrial fibrillation, rate control is the initial priority. Diltiazem (or other calcium channel blockers/beta-blockers) can be used for rate control. Anticoagulation should be initiated unless cardioversion is planned within 48 hours. Since the onset was 2 hours ago and she is stable, there is no need for immediate cardioversion. If cardioversion is desired after rate control, she would need either 3 weeks of anticoagulation or a TEE to rule out atrial thrombus. Adenosine is used for SVT, not atrial fibrillation.',
    difficulty: 'medium',
    tags: ['arrhythmias', 'atrial-fibrillation', 'emergency-medicine']
  },
  {
    id: 'arr-002',
    topicId: 'arrhythmias',
    question: 'A 28-year-old man with a history of Wolff-Parkinson-White syndrome presents with atrial fibrillation. Which medication is contraindicated?',
    options: [
      'Procainamide',
      'Propafenone',
      'Diltiazem',
      'Ibutilide',
      'Flecainide'
    ],
    correctAnswer: 2,
    explanation: 'AV nodal blocking agents (diltiazem, verapamil, beta-blockers, digoxin, adenosine) are contraindicated in WPW with atrial fibrillation because they can preferentially block the AV node, leading to rapid conduction down the accessory pathway and potentially causing ventricular fibrillation. Procainamide is the drug of choice as it slows conduction through the accessory pathway. Other acceptable options include ibutilide, flecainide, and propafenone.',
    optionExplanations: [
      'Procainamide is SAFE and preferred in WPW with AF. It slows conduction through the accessory pathway, preventing rapid ventricular rates and VF.',
      'Propafenone is SAFE in WPW with AF as it slows accessory pathway conduction. It is a Class IC antiarrhythmic that can be used for cardioversion.',
      'CORRECT - Diltiazem is CONTRAINDICATED. As an AV nodal blocker, it can cause preferential conduction down the accessory pathway, leading to extremely rapid ventricular rates and potentially fatal ventricular fibrillation.',
      'Ibutilide is SAFE in WPW with AF. It is a Class III antiarrhythmic that can slow accessory pathway conduction and may be used for cardioversion.',
      'Flecainide is SAFE in WPW with AF. It is a Class IC antiarrhythmic that slows accessory pathway conduction and can be used for rate control.'
    ],
    difficulty: 'hard',
    tags: ['arrhythmias', 'wpw', 'pharmacology'],
    category: 'Cardiology'
  },
  // Diabetes Questions
  {
    id: 'dm-001',
    topicId: 'diabetes',
    question: 'A 52-year-old obese man is diagnosed with type 2 diabetes mellitus with an HbA1c of 8.5%. He has no contraindications to medications. What is the most appropriate first-line pharmacologic therapy?',
    options: [
      'Insulin glargine',
      'Glyburide',
      'Metformin',
      'Sitagliptin',
      'Pioglitazone'
    ],
    correctAnswer: 2,
    explanation: 'Metformin is the first-line pharmacologic therapy for type 2 diabetes mellitus unless contraindicated. It reduces hepatic glucose production, improves insulin sensitivity, promotes modest weight loss, and has cardiovascular benefits. It does not cause hypoglycemia when used as monotherapy. Contraindications include eGFR <30 mL/min, severe liver disease, and conditions predisposing to lactic acidosis. Sulfonylureas like glyburide cause weight gain and hypoglycemia. Insulin is reserved for more severe cases or when oral agents are insufficient.',
    optionExplanations: [
      'Insulin glargine is NOT first-line. While effective, insulin is reserved for severe hyperglycemia (HbA1c >10%), failure of oral agents, or type 1 diabetes. It causes weight gain and requires patient education.',
      'Glyburide is NOT first-line. Sulfonylureas cause hypoglycemia and weight gain, have no cardiovascular benefit, and have largely been replaced by safer alternatives.',
      'CORRECT: Metformin is first-line per ADA/AACE guidelines. It lowers HbA1c ~1-2%, causes modest weight loss, has cardiovascular benefits, doesn\'t cause hypoglycemia, and is inexpensive.',
      'Sitagliptin (DPP-4 inhibitor) is NOT first-line. While well-tolerated, it has modest efficacy (HbA1c reduction ~0.5-0.8%) and is more expensive than metformin.',
      'Pioglitazone (TZD) is NOT first-line. It causes weight gain, fluid retention, bone loss, and increased fracture risk. It may increase bladder cancer risk and heart failure exacerbations.'
    ],
    difficulty: 'easy',
    tags: ['diabetes', 'endocrinology', 'pharmacology'],
    category: 'Endocrinology'
  },
  {
    id: 'dm-002',
    topicId: 'diabetes',
    question: 'A 45-year-old man with type 2 diabetes presents with confusion and drowsiness. Vitals: BP 100/60, HR 110. Labs: glucose 650 mg/dL, Na 130 mEq/L, serum osmolality 340 mOsm/kg, pH 7.38, negative ketones. What is the diagnosis?',
    options: [
      'Diabetic ketoacidosis',
      'Hyperosmolar hyperglycemic state',
      'Lactic acidosis',
      'Hypoglycemia',
      'Alcohol ketoacidosis'
    ],
    correctAnswer: 1,
    explanation: 'This patient has hyperosmolar hyperglycemic state (HHS), characterized by severe hyperglycemia (>600 mg/dL), hyperosmolality (>320 mOsm/kg), altered mental status, and absence of significant ketoacidosis (pH >7.30). HHS typically occurs in type 2 diabetics and is often precipitated by infection, MI, or medication non-compliance. Treatment includes aggressive fluid resuscitation, insulin therapy, and electrolyte replacement. DKA would have acidosis and ketones. The normal pH rules out DKA and lactic acidosis.',
    difficulty: 'medium',
    tags: ['diabetes', 'emergency-medicine', 'endocrinology']
  },
  // Pneumonia Questions
  {
    id: 'pna-001',
    topicId: 'pneumonia',
    question: 'A 35-year-old previously healthy woman presents with 3 days of fever, productive cough, and pleuritic chest pain. Chest X-ray shows a right lower lobe infiltrate. What is the most appropriate outpatient antibiotic regimen?',
    options: [
      'Amoxicillin',
      'Azithromycin or doxycycline',
      'Levofloxacin',
      'Ceftriaxone',
      'Trimethoprim-sulfamethoxazole'
    ],
    correctAnswer: 1,
    explanation: 'For previously healthy outpatients with community-acquired pneumonia and no risk factors for drug-resistant S. pneumoniae, monotherapy with a macrolide (azithromycin) or doxycycline is appropriate. These cover typical pathogens (S. pneumoniae, H. influenzae, M. pneumoniae, C. pneumoniae). If comorbidities are present, combination therapy (beta-lactam + macrolide) or respiratory fluoroquinolone (levofloxacin, moxifloxacin) should be used. Ceftriaxone is parenteral and used for inpatients.',
    difficulty: 'easy',
    tags: ['pneumonia', 'infectious-disease', 'antibiotics']
  },
  {
    id: 'pna-002',
    topicId: 'pneumonia',
    question: 'A 60-year-old man with COPD is admitted with pneumonia. Sputum culture grows Pseudomonas aeruginosa. Which antibiotic regimen provides appropriate coverage?',
    options: [
      'Ceftriaxone',
      'Azithromycin',
      'Piperacillin-tazobactam',
      'Amoxicillin-clavulanate',
      'Cephalexin'
    ],
    correctAnswer: 2,
    explanation: 'Pseudomonas aeruginosa requires antipseudomonal antibiotics. Appropriate choices include piperacillin-tazobactam, cefepime, ceftazidime, aztreonam, carbapenems (except ertapenem), or fluoroquinolones (ciprofloxacin, levofloxacin in higher doses). Dual coverage is often used for severe infections. Ceftriaxone, azithromycin, and amoxicillin-clavulanate do not cover Pseudomonas. Risk factors for Pseudomonas include structural lung disease (bronchiectasis, COPD), recent hospitalization, and recent antibiotic use.',
    difficulty: 'medium',
    tags: ['pneumonia', 'infectious-disease', 'antibiotics', 'pseudomonas']
  },
  // Surgery Questions
  {
    id: 'surg-001',
    topicId: 'appendicitis',
    question: 'A 22-year-old man presents with 12 hours of periumbilical pain that has migrated to the right lower quadrant, anorexia, and fever. McBurney\'s point tenderness is present. WBC is 15,000. What is the most appropriate next step?',
    options: [
      'CT abdomen and pelvis',
      'Observation and serial abdominal exams',
      'Upper endoscopy',
      'Immediate laparoscopic appendectomy',
      'Barium enema'
    ],
    correctAnswer: 3,
    explanation: 'This patient has classic presentation of acute appendicitis (periumbilical pain migrating to RLQ, anorexia, fever, point tenderness, leukocytosis). In a young patient with a classic presentation and high clinical suspicion, immediate appendectomy is appropriate without imaging. However, in many centers, CT is obtained for confirmation, especially in atypical presentations or when other diagnoses are being considered. Delayed treatment increases perforation risk.',
    difficulty: 'easy',
    tags: ['appendicitis', 'surgery', 'emergency-medicine']
  },
  // OB Questions
  {
    id: 'ob-001',
    topicId: 'prenatal-care',
    question: 'A 28-year-old G1P0 at 28 weeks gestation is found to have a 1-hour glucose challenge test of 165 mg/dL. What is the most appropriate next step?',
    options: [
      'Diagnose gestational diabetes and start insulin',
      'Repeat 1-hour glucose challenge test',
      'Perform 3-hour glucose tolerance test',
      'Start metformin',
      'No further testing needed'
    ],
    correctAnswer: 2,
    explanation: 'A positive glucose challenge test (≥140 mg/dL on 1-hour 50g test) requires confirmation with a 3-hour 100g oral glucose tolerance test (OGTT). Gestational diabetes is diagnosed if 2 or more values on the 3-hour OGTT are elevated (fasting ≥95, 1-hr ≥180, 2-hr ≥155, 3-hr ≥140 mg/dL). Initial management of gestational diabetes is diet and exercise, with insulin or metformin added if glucose control is inadequate. Some centers use a 2-step approach (screening then diagnostic test), while others use a single-step 2-hour 75g OGTT.',
    difficulty: 'easy',
    tags: ['prenatal-care', 'gestational-diabetes', 'obstetrics']
  },
  // Pediatrics Questions
  {
    id: 'peds-001',
    topicId: 'well-child-visits',
    question: 'At what age should a child be able to speak in 2-3 word sentences?',
    options: [
      '12 months',
      '18 months',
      '24 months',
      '36 months',
      '48 months'
    ],
    correctAnswer: 2,
    explanation: 'Normal language development milestones: 12 months - single words ("mama," "dada"); 18 months - 10-20 words; 24 months - 2-3 word phrases ("want cookie"); 36 months - 3-4 word sentences, 75% intelligible; 48 months - complete sentences, 100% intelligible. Significant delays warrant audiology evaluation and possible speech therapy referral.',
    difficulty: 'easy',
    tags: ['development', 'pediatrics', 'well-child']
  },
  // Psychiatry Questions
  {
    id: 'psych-001',
    topicId: 'major-depression',
    question: 'A 45-year-old woman with major depressive disorder has not responded to adequate trials of sertraline and bupropion. She has severe symptoms affecting her work and relationships. What is the most appropriate next step?',
    options: [
      'Add lithium augmentation',
      'Switch to venlafaxine',
      'Electroconvulsive therapy',
      'Add cognitive behavioral therapy',
      'Increase sertraline dose'
    ],
    correctAnswer: 1,
    explanation: 'After failure of 2 adequate trials of antidepressants from different classes, the next step is typically to try another agent (such as an SNRI like venlafaxine or duloxetine), augmentation with another medication (lithium, thyroid hormone, or second-generation antipsychotic), or combination therapy. ECT is highly effective but typically reserved for severe, treatment-resistant depression, depression with psychotic features, or when rapid response is needed (e.g., catatonia, severe suicidality). CBT should be added at any stage. Lithium augmentation is also reasonable but switching to a different class is often tried first.',
    difficulty: 'medium',
    tags: ['depression', 'psychiatry', 'pharmacology']
  },
  // Neurology Questions  
  {
    id: 'neuro-001',
    topicId: 'ischemic-stroke',
    question: 'A 70-year-old man presents 2 hours after sudden onset of right-sided weakness and aphasia. CT head shows no hemorrhage. BP is 185/100. What is the most appropriate treatment?',
    options: [
      'Aspirin 325 mg',
      'IV alteplase',
      'Immediate blood pressure reduction to <140/90',
      'Heparin infusion',
      'Warfarin'
    ],
    correctAnswer: 1,
    explanation: 'This patient has acute ischemic stroke presenting within 4.5 hours, making him a candidate for IV thrombolysis with alteplase (tPA). CT ruled out hemorrhage. BP is acceptable for tPA (must be <185/110). Aspirin should be held for 24 hours after tPA. Blood pressure should not be aggressively lowered before or during tPA unless >185/110, as this may worsen cerebral perfusion. Anticoagulation is not used in acute ischemic stroke except for specific situations like cardioembolic stroke.',
    difficulty: 'medium',
    tags: ['stroke', 'neurology', 'emergency-medicine']
  }
];

// Function to get questions by topic ID
export function getQuestionsByTopicId(topicId: string): Question[] {
  return sampleQuestions.filter(q => q.topicId === topicId);
}

// Function to generate mock questions for any topic
export function generateMockQuestions(topicId: string, count: number): Question[] {
  const existing = getQuestionsByTopicId(topicId);
  if (existing.length >= count) {
    return existing.slice(0, count);
  }
  
  // Return existing or sample questions as mock data
  return sampleQuestions.slice(0, Math.min(count, sampleQuestions.length));
}