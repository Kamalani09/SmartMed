// Sample data for customer dashboard
const currentCustomer = {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    phone: "+1234567890",
    address: "123 Main St, City, State 12345"
};

const medicines = [
    { 
        id: 1, 
        name: "Paracetamol", 
        generic: "Acetaminophen", 
        price: 50, 
        stock: 100, 
        vendor: "MedSupply Co.",
        dosage: "500mg",
        description: "Used to treat pain and fever. Common pain reliever and fever reducer.",
        category: "Pain Relief",
        prescriptionRequired: false,
        sideEffects: "Nausea, stomach pain, loss of appetite"
    },
    { 
        id: 2, 
        name: "Amoxicillin", 
        generic: "Amoxicillin", 
        price: 120, 
        stock: 50, 
        vendor: "PharmaDistributors",
        dosage: "250mg",
        description: "Antibiotic used to treat bacterial infections including tonsillitis, bronchitis, and pneumonia.",
        category: "Antibiotics",
        prescriptionRequired: true,
        sideEffects: "Nausea, vomiting, diarrhea"
    },
    { 
        id: 3, 
        name: "Atorvastatin", 
        generic: "Atorvastatin Calcium", 
        price: 180, 
        stock: 30, 
        vendor: "HealthCare Supplies",
        dosage: "10mg",
        description: "Lowers cholesterol and triglyceride levels in the blood to prevent heart disease.",
        category: "Cardiovascular",
        prescriptionRequired: true,
        sideEffects: "Headache, muscle pain, diarrhea"
    },
    { 
        id: 4, 
        name: "Metformin", 
        generic: "Metformin HCl", 
        price: 90, 
        stock: 70, 
        vendor: "MedSupply Co.",
        dosage: "500mg",
        description: "Used for type 2 diabetes treatment. Helps control blood sugar levels.",
        category: "Diabetes",
        prescriptionRequired: true,
        sideEffects: "Nausea, vomiting, diarrhea, weakness"
    },
    { 
        id: 5, 
        name: "Losartan", 
        generic: "Losartan Potassium", 
        price: 150, 
        stock: 40, 
        vendor: "PharmaDistributors",
        dosage: "50mg",
        description: "Treats high blood pressure and helps protect kidneys from damage due to diabetes.",
        category: "Cardiovascular",
        prescriptionRequired: true,
        sideEffects: "Dizziness, stuffy nose, back pain"
    },
    { 
        id: 6, 
        name: "Ibuprofen", 
        generic: "Ibuprofen", 
        price: 40, 
        stock: 80, 
        vendor: "HealthCare Supplies",
        dosage: "400mg",
        description: "Nonsteroidal anti-inflammatory drug used to treat pain, fever, and inflammation.",
        category: "Pain Relief",
        prescriptionRequired: false,
        sideEffects: "Stomach pain, heartburn, dizziness"
    },
    { 
        id: 7, 
        name: "Omeprazole", 
        generic: "Omeprazole", 
        price: 110, 
        stock: 60, 
        vendor: "MedSupply Co.",
        dosage: "20mg",
        description: "Treats gastroesophageal reflux disease (GERD) and other conditions caused by excess stomach acid.",
        category: "Gastrointestinal",
        prescriptionRequired: true,
        sideEffects: "Headache, abdominal pain, nausea"
    },
    { 
        id: 8, 
        name: "Cetirizine", 
        generic: "Cetirizine HCl", 
        price: 35, 
        stock: 120, 
        vendor: "PharmaDistributors",
        dosage: "10mg",
        description: "Antihistamine used to relieve allergy symptoms such as watery eyes, runny nose, and sneezing.",
        category: "Allergy",
        prescriptionRequired: false,
        sideEffects: "Drowsiness, fatigue, dry mouth"
    }
];

let customerOrders = [
    { 
        id: 1001, 
        customerId: 1, 
        date: "2023-11-15", 
        items: [
            {medicineId: 1, name: "Paracetamol", quantity: 2, price: 50}, 
            {medicineId: 6, name: "Ibuprofen", quantity: 1, price: 40}
        ], 
        total: 140, 
        status: "approved",
        prescriptionRequired: false
    },
    { 
        id: 1002, 
        customerId: 1, 
        date: "2023-11-10", 
        items: [
            {medicineId: 2, name: "Amoxicillin", quantity: 1, price: 120}, 
            {medicineId: 4, name: "Metformin", quantity: 1, price: 90}
        ], 
        total: 210, 
        status: "pending",
        prescriptionRequired: true,
        prescriptionApproved: false
    },
    { 
        id: 1003, 
        customerId: 1, 
        date: "2023-11-05", 
        items: [
            {medicineId: 3, name: "Atorvastatin", quantity: 1, price: 180}, 
            {medicineId: 8, name: "Cetirizine", quantity: 2, price: 35}
        ], 
        total: 250, 
        status: "completed",
        prescriptionRequired: true,
        prescriptionApproved: true
    }
];

// Shopping cart
let shoppingCart = [];

// Utility functions
function generateOrderId() {
    return Math.floor(1000 + Math.random() * 9000);
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

function formatCurrency(amount) {
    return '₹' + amount.toFixed(2);
}