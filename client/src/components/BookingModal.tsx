import React, { useState, useEffect } from "react";
import { X, CalendarCheck2, CheckCircle2 } from "lucide-react";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BookingModal = ({ isOpen, onClose }: BookingModalProps) => {
  const [formData, setFormData] = useState({
    fullName: "",
    whatsAppNumber: "+880",
    age: "",
    patientRelation: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleWhatsAppChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    if (!val.startsWith("+880")) {
      val = "+880";
    }
    const rest = val.substring(4).replace(/\D/g, "");
    // User can write at most 10 digits after +880 (e.g. 1712345678), making it 11 numbers including the '0' of '+880'
    const limitedRest = rest.slice(0, 10);
    setFormData({ ...formData, whatsAppNumber: "+880" + limitedRest });
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }
    if (formData.whatsAppNumber === "+880") {
      newErrors.whatsAppNumber = "WhatsApp number is required";
    } else {
      const rest = formData.whatsAppNumber.substring(4);
      if (rest.length < 10) {
        newErrors.whatsAppNumber = "Please enter all 10 digits after +880";
      } else if (!/^1[3-9]\d{8}$/.test(rest)) {
        newErrors.whatsAppNumber = "Please enter a valid Bangladeshi mobile number";
      }
    }
    if (!formData.age.trim()) {
      newErrors.age = "Age is required";
    } else {
      const ageNum = parseInt(formData.age, 10);
      if (isNaN(ageNum) || ageNum <= 0 || ageNum > 120) {
        newErrors.age = "Please enter a valid age";
      }
    }
    if (!formData.patientRelation) {
      newErrors.patientRelation = "Please select who the patient is";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitted(true);

      const relationMap: Record<string, string> = {
        me: "myself",
        parent: "my parent",
        sibling: "my sibling",
        relative: "my relative",
        other: "someone else",
      };
      const relationLabel = relationMap[formData.patientRelation] || formData.patientRelation;
      const message = `Hello, I'm ${formData.fullName}. My age is ${formData.age}. I want to set an appointment for ${relationLabel}.`;
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/8801805218786?text=${encodedMessage}`;
      
      window.open(whatsappUrl, "_blank");

      // Reset form fields after submission
      setFormData({
        fullName: "",
        whatsAppNumber: "+880",
        age: "",
        patientRelation: "",
      });
    }
  };

  const handleClose = () => {
    setIsSubmitted(false);
    setErrors({});
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-md transition-opacity duration-300">
      {/* Modal Backdrop click handler */}
      <div className="absolute inset-0" onClick={handleClose} />

      {/* Modal Container */}
      <div className="relative z-10 w-full max-w-md mx-4 overflow-hidden rounded-2xl bg-white border border-teal-100 shadow-2xl transition-all duration-300 scale-100 animate-in fade-in zoom-in-95">
        
        {/* Header decoration gradient */}
        <div className="h-2 bg-gradient-to-r from-cyan-400 via-teal-500 to-blue-500" />

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        {!isSubmitted ? (
          <div className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 rounded-xl bg-teal-50 text-teal-600">
                <CalendarCheck2 size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800">Book Appointment</h3>
                <p className="text-xs text-slate-500">Fill in the details to request your schedule.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <label htmlFor="fullName" className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Enter full name"
                  className={`w-full px-4 py-2.5 rounded-xl border bg-slate-50/50 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                    errors.fullName
                      ? "border-red-300 focus:ring-red-200"
                      : "border-slate-200 focus:border-teal-500 focus:ring-teal-100"
                  }`}
                />
                {errors.fullName && (
                  <p className="mt-1 text-[11px] text-red-500 font-medium">{errors.fullName}</p>
                )}
              </div>

              {/* WhatsApp Number */}
              <div>
                <label htmlFor="whatsAppNumber" className="block text-xs font-semibold text-slate-600 mb-1.5">
                  WhatsApp Number
                </label>
                <input
                  type="tel"
                  id="whatsAppNumber"
                  value={formData.whatsAppNumber}
                  onChange={handleWhatsAppChange}
                  placeholder="enter your number"
                  className={`w-full px-4 py-2.5 rounded-xl border bg-slate-50/50 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                    errors.whatsAppNumber
                      ? "border-red-300 focus:ring-red-200"
                      : "border-slate-200 focus:border-teal-500 focus:ring-teal-100"
                  }`}
                />
                {errors.whatsAppNumber && (
                  <p className="mt-1 text-[11px] text-red-500 font-medium">{errors.whatsAppNumber}</p>
                )}
              </div>

              {/* Age */}
              <div>
                <label htmlFor="age" className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Age
                </label>
                <input
                  type="number"
                  id="age"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  placeholder="Enter age"
                  min="1"
                  max="120"
                  className={`w-full px-4 py-2.5 rounded-xl border bg-slate-50/50 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                    errors.age
                      ? "border-red-300 focus:ring-red-200"
                      : "border-slate-200 focus:border-teal-500 focus:ring-teal-100"
                  }`}
                />
                {errors.age && (
                  <p className="mt-1 text-[11px] text-red-500 font-medium">{errors.age}</p>
                )}
              </div>

              {/* Patient Dropdown */}
              <div>
                <label htmlFor="patientRelation" className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Patient Relation
                </label>
                <div className="relative">
                  <select
                    id="patientRelation"
                    value={formData.patientRelation}
                    onChange={(e) => setFormData({ ...formData, patientRelation: e.target.value })}
                    className={`w-full px-4 py-2.5 rounded-xl border bg-slate-50/50 text-sm text-slate-800 appearance-none focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                      errors.patientRelation
                        ? "border-red-300 focus:ring-red-200"
                        : "border-slate-200 focus:border-teal-500 focus:ring-teal-100"
                    }`}
                  >
                    <option value="" disabled>Select patient</option>
                    <option value="me">Self (Me)</option>
                    <option value="parent">Parent</option>
                    <option value="sibling">Sibling</option>
                    <option value="relative">Relative</option>
                    <option value="other">Other</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                    </svg>
                  </div>
                </div>
                {errors.patientRelation && (
                  <p className="mt-1 text-[11px] text-red-500 font-medium">{errors.patientRelation}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full mt-4 cursor-pointer bg-gradient-to-r from-cyan-500 via-cyan-500 to-blue-500 hover:from-cyan-600 hover:via-cyan-600 hover:to-blue-600 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-teal-400/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                Submit Booking
              </button>
            </form>
          </div>
        ) : (
          /* Success Screen */
          <div className="p-8 text-center flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-300">
            <div className="p-3 rounded-full bg-teal-50 text-teal-500 mb-4 animate-bounce">
              <CheckCircle2 size={48} />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">Booking Submitted!</h3>
            <p className="text-sm text-slate-600 mb-6">
              Thank you! Your appointment request has been successfully submitted. We will reach out to you on WhatsApp shortly.
            </p>
            <button
              onClick={handleClose}
              className="w-full cursor-pointer bg-slate-800 hover:bg-slate-900 text-white font-semibold py-2.5 px-6 rounded-xl transition-colors duration-200"
            >
              Back to Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingModal;
