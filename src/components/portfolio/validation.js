export const portfolioValidation = {
    portfolioName: (value) => {
        if (!value || !value.trim()) return 'กรุณากรอกชื่อ Portfolio';
        if (value.trim().length < 3) return 'ชื่อ Portfolio ต้องมีอย่างน้อย 3 ตัวอักษร';
        if (value.trim().length > 50) return 'ชื่อ Portfolio ต้องไม่เกิน 50 ตัวอักษร';
        return '';
    },

    asset: (value) => {
        if (!value) return 'กรุณาเลือก Asset';
        return '';
    },

    amount: (value) => {
        if (!value && value !== 0) return 'กรุณากรอกจำนวนเงิน';
        const numValue = parseFloat(value);
        if (isNaN(numValue)) return 'จำนวนเงินต้องเป็นตัวเลข';
        if (numValue <= 0) return 'จำนวนเงินต้องมากกว่า 0';
        if (numValue > 999999999) return 'จำนวนเงินสูงเกินไป';
        return '';
    },

    description: (value) => {
        if (value && value.length > 1200) return 'คำอธิบายต้องไม่เกิน 1200 ตัวอักษร';
        return '';
    }
};

export const transactionValidation = {
    price: (value) => {
        if (!value && value !== 0) return 'กรุณากรอกราคา';
        const numValue = parseFloat(value);
        if (isNaN(numValue)) return 'ราคาต้องเป็นตัวเลข';
        if (numValue <= 0) return 'ราคาต้องมากกว่า 0';
        if (numValue > 999999999) return 'ราคาสูงเกินไป';
        return '';
    },

    quantity: (value) => {
        if (!value && value !== 0) return 'กรุณากรอกจำนวน';
        const numValue = parseFloat(value);
        if (isNaN(numValue)) return 'จำนวนต้องเป็นตัวเลข';
        if (numValue <= 0) return 'จำนวนต้องมากกว่า 0';
        if (numValue > 999999999) return 'จำนวนสูงเกินไป';
        return '';
    },

    commission: (value) => {
        if (value === '' || value === null || value === undefined) return ''; // Commission is optional
        const numValue = parseFloat(value);
        if (isNaN(numValue)) return 'ค่าธรรมเนียมต้องเป็นตัวเลข';
        if (numValue < 0) return 'ค่าธรรมเนียมต้องไม่ติดลบ';
        if (numValue > 999999999) return 'ค่าธรรมเนียมสูงเกินไป';
        return '';
    },

    transactionDate: (value) => {
        if (!value) return 'กรุณาเลือกวันที่';
        const selectedDate = new Date(value);
        const today = new Date();
        today.setHours(23, 59, 59, 999); // Set to end of today

        if (isNaN(selectedDate.getTime())) return 'รูปแบบวันที่ไม่ถูกต้อง';
        if (selectedDate > today) return 'ไม่สามารถเลือกวันที่ในอนาคตได้';

        // Check if date is too far in the past (e.g., before year 2000)
        const minDate = new Date('2000-01-01');
        if (selectedDate < minDate) return 'วันที่ไม่ถูกต้อง';

        return '';
    },

    notes: (value) => {
        if (value && value.length > 128) return 'โน้ตต้องไม่เกิน 128 ตัวอักษร';
        return '';
    }
};

// Helper function to validate all fields at once
export const validatePortfolioForm = (formData) => {
    const errors = {};

    const nameError = portfolioValidation.portfolioName(formData.name);
    if (nameError) errors.name = nameError;

    const assetError = portfolioValidation.asset(formData.asset);
    if (assetError) errors.asset = assetError;

    // total_invested is optional now (removed from form)
    // const amountError = portfolioValidation.amount(formData.total_invested);
    // if (amountError) errors.total_invested = amountError;

    const descriptionError = portfolioValidation.description(formData.description);
    if (descriptionError) errors.description = descriptionError;

    return errors;
};

export const validateTransactionForm = (formData) => {
    const errors = {};

    const priceError = transactionValidation.price(formData.price);
    if (priceError) errors.price = priceError;

    const quantityError = transactionValidation.quantity(formData.quantity);
    if (quantityError) errors.quantity = quantityError;

    const commissionError = transactionValidation.commission(formData.commission);
    if (commissionError) errors.commission = commissionError;

    const dateError = transactionValidation.transactionDate(formData.date);
    if (dateError) errors.date = dateError;

    const notesError = transactionValidation.notes(formData.notes);
    if (notesError) errors.notes = notesError;

    return errors;
};
