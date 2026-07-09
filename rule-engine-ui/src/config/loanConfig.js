export const LOAN_CONFIG = {
  "Home Loan": {
    fields: [
      { id: "applicant_age", label: "Applicant Age", type: "number" },
      { id: "monthly_income", label: "Monthly Income", type: "number" },
      { id: "employment_type", label: "Employment Type", type: "select", options: ["Salaried", "Self Employed", "Business"] },
      { id: "years_experience", label: "Years of Experience", type: "number" },
      { id: "cibil_score", label: "CIBIL Score", type: "number" },
      { id: "property_value", label: "Property Value", type: "number" },
      { id: "loan_amount", label: "Loan Amount", type: "number" },
      { id: "existing_emi", label: "Existing EMI", type: "number" }
    ]
  },
  "Car Loan": {
    fields: [
      { id: "applicant_age", label: "Applicant Age", type: "number" },
      { id: "monthly_income", label: "Monthly Income", type: "number" },
      { id: "vehicle_cost", label: "Vehicle Cost", type: "number" },
      { id: "vehicle_type", label: "Vehicle Type", type: "text" },
      { id: "down_payment", label: "Down Payment", type: "number" },
      { id: "driving_license", label: "Driving License", type: "select", options: ["Yes", "No"] },
      { id: "cibil_score", label: "CIBIL Score", type: "number" }
    ]
  },
  "Education Loan": {
    fields: [
      { id: "student_age", label: "Student Age", type: "number" },
      { id: "course_type", label: "Course Type", type: "text" },
      { id: "university_tier", label: "University Tier", type: "select", options: ["Tier 1", "Tier 2", "Tier 3"] },
      { id: "admission_confirmed", label: "Admission Confirmed", type: "select", options: ["Yes", "No"] },
      { id: "country", label: "Country", type: "select", options: ["India", "United States", "United Kingdom", "Canada", "Australia", "Singapore", "Germany", "France", "United Arab Emirates", "Other"] },
      { id: "coapplicant_income", label: "Co-applicant Income", type: "number" },
      { id: "coapplicant_cibil", label: "Co-applicant CIBIL", type: "number" },
      { id: "scholarship", label: "Scholarship", type: "select", options: ["Yes", "No"] }
    ]
  },
  "Gold Loan": {
    fields: [
      { id: "gold_weight", label: "Gold Weight", type: "number" },
      { id: "gold_purity", label: "Gold Purity", type: "number" },
      { id: "gold_value", label: "Gold Value", type: "number" },
      { id: "loan_amount", label: "Loan Amount", type: "number" }
    ]
  }
};

export function fieldLabel(product, fieldId) {
  const field = (LOAN_CONFIG[product]?.fields || []).find((f) => f.id === fieldId);
  return field ? field.label : fieldId;
}