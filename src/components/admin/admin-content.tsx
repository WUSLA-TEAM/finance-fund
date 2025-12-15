"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
    Plus,
    Save,
    Building2,
    Users,
    UserPlus,
    Clock,
    IndianRupee,
    Check
} from "lucide-react";

interface Department {
    id: string;
    name: string;
    _count?: {
        students: number;
    };
}

interface Student {
    id: string;
    name: string;
    admissionNumber?: string | null;
    amountPaid: number;
    department: {
        name: string;
    };
    departmentId?: string;
}

interface AdminContentProps {
    departments: Department[];
    recentStudents: Student[];
}

function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(amount);
}

export function AdminContent({ departments, recentStudents }: AdminContentProps) {
    const router = useRouter();

    // Bulk Import state
    const [activeTab, setActiveTab] = useState<"manual" | "bulk">("manual");
    const [importFile, setImportFile] = useState<File | null>(null);
    const [importLoading, setImportLoading] = useState(false);
    const [importMessage, setImportMessage] = useState("");
    const fileInputRef = useState<any>(null); // Hacky ref

    // Receipt / Reference State
    const [receiptFile, setReceiptFile] = useState<File | null>(null);
    // Receipt / Reference State

    // const [referenceNote, setReferenceNote] = useState(""); // Removed in favor of dynamic fields

    // Payment Method State
    const [paymentMethod, setPaymentMethod] = useState("CASH ON HAND"); // Default to Cash on Hand
    const [transactionId, setTransactionId] = useState("");
    const [paymentNote, setPaymentNote] = useState("");

    const paymentMethods = [
        "CAMPUS ACCOUNT",
        "SPECIAL ACCOUNT",
        "CASH ON HAND"
    ];
    // Student form state (Manual)
    const [studentName, setStudentName] = useState("");
    const [admissionNumber, setAdmissionNumber] = useState("");
    // departmentId is needed for both manual and bulk, but we had it before?
    // Wait, departmentId usage in line 70 suggests it was missing too?
    // Let's check line 70: if (!importFile || !departmentId)
    // We need to make sure departmentId is defined.
    // In original file it was: const [departmentId, setDepartmentId] = useState(departments[0]?.id || "");
    const [departmentId, setDepartmentId] = useState(departments[0]?.id || "");
    const [amountPaid, setAmountPaid] = useState("");
    const [studentLoading, setStudentLoading] = useState(false);
    const [studentMessage, setStudentMessage] = useState("");

    // Update payment state
    const [selectedDeptForUpdate, setSelectedDeptForUpdate] = useState("");
    const [selectedStudent, setSelectedStudent] = useState("");
    const [additionalAmount, setAdditionalAmount] = useState("");
    const [quickSearchQuery, setQuickSearchQuery] = useState("");
    const [updateLoading, setUpdateLoading] = useState(false);
    const [updateMessage, setUpdateMessage] = useState("");
    const [searchStatus, setSearchStatus] = useState<{ found: boolean; msg: string } | null>(null);


    // Department form state
    const [deptName, setDeptName] = useState("");
    const [deptLoading, setDeptLoading] = useState(false);
    const [deptMessage, setDeptMessage] = useState("");

    // Filter students by selected department
    const filteredStudents = selectedDeptForUpdate
        ? recentStudents.filter(s => {
            const studentDept = departments.find(d => d.name === s.department.name);
            return studentDept?.id === selectedDeptForUpdate;
        })
        : [];

    // Auto-select first department when departments list changes
    useEffect(() => {
        if (departments.length > 0 && !departmentId) {
            setDepartmentId(departments[0].id);
        }
    }, [departments, departmentId]);

    // Reset student selection when department changes, BUT NOT if it was triggered by our quick search logic
    useEffect(() => {
        if (!selectedDeptForUpdate) {
            setSelectedStudent("");
            return;
        }

        // If we have a selected student, check if they are in the new department
        // If they are NOT in the new department, clear the selection
        if (selectedStudent) {
            const student = recentStudents.find(s => s.id === selectedStudent);

            // Matches if found AND departmentId matches (if available) or fall back to name comparison
            const isMatch = student && (
                student.departmentId === selectedDeptForUpdate ||
                (student.department && departments.find(d => d.id === selectedDeptForUpdate)?.name === student.department.name)
            );

            if (!isMatch) {
                setSelectedStudent("");
            }
        }
    }, [selectedDeptForUpdate]);

    const handleStudentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStudentLoading(true);
        setStudentMessage("");

        if (!departmentId || departmentId === "") {
            setStudentMessage("Error: Please select a department");
            setStudentLoading(false);
            return;
        }

        try {
            const res = await fetch("/api/admin/student", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: studentName.trim(),
                    admissionNumber: admissionNumber.trim() || null,
                    departmentId: departmentId,
                    amountPaid: Number(amountPaid) || 0,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                setStudentMessage("✓ Student added successfully!");
                setStudentName("");
                setAdmissionNumber("");
                setAmountPaid("");
                router.refresh();
                // Clear message after 3 seconds
                setTimeout(() => setStudentMessage(""), 3000);
            } else {
                setStudentMessage(`Error: ${data.error || "Failed to add student"}`);
            }
        } catch (error) {
            setStudentMessage("Network error occurred");
        } finally {
            setStudentLoading(false);
        }
    };
    const handleBulkImport = async (e: React.FormEvent) => {
        e.preventDefault();
        setImportLoading(true);
        setImportMessage("");

        if (!importFile || !departmentId) {
            setImportMessage("Please select a file and department");
            setImportLoading(false);
            return;
        }

        try {
            const formData = new FormData();
            formData.append("file", importFile);
            formData.append("departmentId", departmentId);

            const res = await fetch("/api/admin/import-students", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();

            if (res.ok) {
                setImportMessage(`✓ ${data.message}`);
                setImportFile(null);
                router.refresh();
                setTimeout(() => setImportMessage(""), 5000);
            } else {
                setImportMessage(`Error: ${data.error || "Import failed"}`);
            }
        } catch (error) {
            setImportMessage("Network error during import");
        } finally {
            setImportLoading(false);
        }
    };

    const handleUpdatePayment = async (e: React.FormEvent) => {
        e.preventDefault();
        setUpdateLoading(true);
        setUpdateMessage("");

        if (!selectedStudent) {
            setUpdateMessage("Error: Please select a student");
            setUpdateLoading(false);
            return;
        }

        try {

            // Construct reference string
            // Construct reference string
            let finalReference = "";
            if (["CAMPUS ACCOUNT", "SPECIAL ACCOUNT"].includes(paymentMethod)) {
                finalReference = `Method: ${paymentMethod} | Ref: ${transactionId || 'N/A'}`;
            } else {
                finalReference = `Method: ${paymentMethod} | Note: ${paymentNote || 'N/A'}`;
            }

            const formData = new FormData();
            formData.append("studentId", selectedStudent);
            formData.append("amount", additionalAmount);
            formData.append("reference", finalReference);
            if (receiptFile) formData.append("file", receiptFile);

            const res = await fetch("/api/admin/update-payment", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();

            if (res.ok) {
                setUpdateMessage(`✓ Added ${formatCurrency(Number(additionalAmount))} - New total: ${formatCurrency(data.newTotal)}`);
                setAdditionalAmount("");
                setAdditionalAmount("");
                // Reset fields
                setTransactionId("");
                setPaymentNote("");
                setReceiptFile(null);
                setSelectedStudent("");
                setQuickSearchQuery("");
                router.refresh();
                setTimeout(() => setUpdateMessage(""), 4000);
            } else {
                setUpdateMessage(`Error: ${data.error || "Failed to update"}`);
            }
        } catch (error) {
            setUpdateMessage("Network error occurred");
        } finally {
            setUpdateLoading(false);
        }
    };




    const handleDeptSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setDeptLoading(true);
        setDeptMessage("");

        try {
            const res = await fetch("/api/admin/department", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: deptName }),
            });

            const data = await res.json();

            if (res.ok) {
                setDeptMessage("✓ Department added!");
                setDeptName("");
                router.refresh();
                setTimeout(() => setDeptMessage(""), 3000);
            } else {
                setDeptMessage(`Error: ${data.error || "Failed to add"}`);
            }
        } catch (error) {
            setDeptMessage("Network error occurred");
        } finally {
            setDeptLoading(false);
        }
    };

    // Get selected student info
    const selectedStudentInfo = recentStudents.find(s => s.id === selectedStudent);

    return (
        <main className="main-content">
            {/* Header */}
            <motion.div
                className="welcome-section"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div>
                    <h1 className="welcome-title">
                        Admin Panel
                        <span>Manage students and payments</span>
                    </h1>
                </div>
            </motion.div>

            {/* Stats Row */}
            <motion.div
                className="admin-stats"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '20px',
                    marginBottom: '32px'
                }}
            >
                <div className="stat-card">
                    <div className="stat-icon">
                        <Building2 size={22} />
                    </div>
                    <div className="stat-info">
                        <span className="stat-value">{departments.length}</span>
                        <span className="stat-label">Departments</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'rgba(76, 175, 80, 0.1)', color: '#4caf50' }}>
                        <Users size={22} />
                    </div>
                    <div className="stat-info">
                        <span className="stat-value">
                            {departments.reduce((acc, d) => acc + (d._count?.students || 0), 0)}
                        </span>
                        <span className="stat-label">Total Students</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'rgba(255, 152, 0, 0.1)', color: '#ff9800' }}>
                        <IndianRupee size={22} />
                    </div>
                    <div className="stat-info">
                        <span className="stat-value">
                            {formatCurrency(recentStudents.reduce((acc, s) => acc + s.amountPaid, 0))}
                        </span>
                        <span className="stat-label">Recent Collection</span>
                    </div>
                </div>
            </motion.div>

            {/* Forms Grid - 3 columns */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '32px' }}>
                {/* Add Student Form */}
                <motion.div
                    className="admin-card"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="admin-card-header">
                        <div className="admin-card-icon">
                            <UserPlus size={20} />
                        </div>
                        <h2 className="admin-card-title">Add Students</h2>
                    </div>

                    <div className="flex gap-2 p-4 pb-0 border-b border-white/5">
                        <button
                            onClick={() => setActiveTab("manual")}
                            className={`px-3 py-1.5 text-xs rounded-md transition-colors ${activeTab === "manual" ? "bg-white/10 text-white" : "text-muted-foreground hover:text-white"}`}
                        >
                            Manual Entry
                        </button>
                        <button
                            onClick={() => setActiveTab("bulk")}
                            className={`px-3 py-1.5 text-xs rounded-md transition-colors ${activeTab === "bulk" ? "bg-white/10 text-white" : "text-muted-foreground hover:text-white"}`}
                        >
                            Bulk Import (CSV)
                        </button>
                    </div>

                    {activeTab === "manual" ? (
                        <form onSubmit={handleStudentSubmit} className="admin-form">
                            <div className="form-group">
                                <label className="form-label">Department</label>
                                <select
                                    value={departmentId}
                                    onChange={(e) => setDepartmentId(e.target.value)}
                                    className="form-select"
                                >
                                    {departments.map((dept) => (
                                        <option key={dept.id} value={dept.id}>
                                            {dept.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Student Name</label>
                                <input
                                    type="text"
                                    required
                                    value={studentName}
                                    onChange={(e) => setStudentName(e.target.value)}
                                    className="form-input"
                                    placeholder="Enter name"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Admission / CIC Number</label>
                                <input
                                    type="text"
                                    required
                                    value={admissionNumber}
                                    onChange={(e) => setAdmissionNumber(e.target.value)}
                                    className="form-input"
                                    placeholder="e.g. CIC-123"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Initial Amount (₹)</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={amountPaid}
                                    onChange={(e) => setAmountPaid(e.target.value)}
                                    className="form-input"
                                    placeholder="0"
                                />
                            </div>

                            <button type="submit" className="form-btn primary" disabled={studentLoading}>
                                <Save size={18} />
                                {studentLoading ? "Saving..." : "Add Student"}
                            </button>

                            {studentMessage && (
                                <div className={`form-message ${studentMessage.includes('Error') ? 'error' : 'success'}`}>
                                    {studentMessage}
                                </div>
                            )}
                        </form>
                    ) : (
                        <form onSubmit={handleBulkImport} className="admin-form">
                            <div className="form-group">
                                <label className="form-label">Department</label>
                                <select
                                    value={departmentId}
                                    onChange={(e) => setDepartmentId(e.target.value)}
                                    className="form-select"
                                >
                                    {departments.map((dept) => (
                                        <option key={dept.id} value={dept.id}>
                                            {dept.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">CSV File</label>
                                <div className="border border-dashed border-white/20 rounded-lg p-4 text-center hover:bg-white/5 transition-colors">
                                    <input
                                        type="file"
                                        accept=".csv,.txt"
                                        onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                                        className="hidden"
                                        id="csv-upload"
                                    />
                                    <label htmlFor="csv-upload" className="cursor-pointer block">
                                        <div className="text-sm text-muted-foreground mb-1">
                                            {importFile ? importFile.name : "Click to select CSV"}
                                        </div>
                                        <div className="text-xs text-muted-foreground opacity-60">
                                            Format: Name, Admission No, Amount
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <button type="submit" className="form-btn primary" disabled={importLoading || !importFile}>
                                <UserPlus size={18} />
                                {importLoading ? "Importing..." : "Upload & Import"}
                            </button>

                            {importMessage && (
                                <div className={`form-message ${importMessage.includes('Error') ? 'error' : 'success'}`}>
                                    {importMessage}
                                </div>
                            )}
                        </form>
                    )}
                </motion.div>

                {/* Update Payment Form - NEW */}
                <motion.div
                    className="admin-card"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                >
                    <div className="admin-card-header">
                        <div className="admin-card-icon" style={{ background: 'rgba(76, 175, 80, 0.1)', color: '#4caf50' }}>
                            <IndianRupee size={20} />
                        </div>
                        <h2 className="admin-card-title">Update Payment</h2>
                    </div>

                    <form onSubmit={handleUpdatePayment} className="admin-form">

                        <div className="form-group mb-4 p-3 bg-emerald-500/5 rounded-xl border border-emerald-500/10">
                            <label className="form-label text-emerald-400">⚡ Quick Find (Admission No.)</label>
                            <input
                                type="text"
                                value={quickSearchQuery}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setQuickSearchQuery(val);
                                    if (val.trim()) {
                                        // Find student by admission number (starts with - case insensitive)
                                        const found = recentStudents.find(s =>
                                            s.admissionNumber && s.admissionNumber.toLowerCase().startsWith(val.trim().toLowerCase())
                                        );

                                        if (found) {
                                            setSearchStatus({ found: true, msg: `Found: ${found.name}` });

                                            // Prefer using departmentId if available, otherwise find by name
                                            let deptId = found.departmentId;

                                            if (!deptId) {
                                                const dept = departments.find(d => d.name === found.department.name);
                                                deptId = dept?.id;
                                            }

                                            if (deptId) {
                                                // Batch these updates
                                                setSelectedDeptForUpdate(deptId);
                                                // Use setTimeout to ensure this runs after any potential useEffect clearing
                                                setTimeout(() => setSelectedStudent(found.id), 0);
                                            }
                                        } else {
                                            setSearchStatus({ found: false, msg: "No match found" });
                                        }
                                    } else {
                                        setSearchStatus(null);
                                    }
                                }}
                                className={`form-input border-emerald-500/30 focus:border-emerald-500 ${searchStatus?.found ? 'border-green-500 bg-green-500/10' : ''} ${searchStatus?.found === false ? 'border-red-500 bg-red-500/10' : ''}`}
                                placeholder="Enter Admission Number..."
                            />
                            {searchStatus && (
                                <div className={`text-xs mt-1 ${searchStatus.found ? 'text-green-400' : 'text-red-400'}`}>
                                    {searchStatus.msg}
                                </div>
                            )}
                        </div>

                        <div className="form-group">
                            <label className="form-label">1. Select Department</label>
                            <select
                                value={selectedDeptForUpdate}
                                onChange={(e) => setSelectedDeptForUpdate(e.target.value)}
                                className="form-select"
                            >
                                <option value="">-- Choose department --</option>
                                {departments.map((dept) => (
                                    <option key={dept.id} value={dept.id}>
                                        {dept.name} ({dept._count?.students || 0} students)
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">2. Select Student</label>
                            <select
                                value={selectedStudent}
                                onChange={(e) => setSelectedStudent(e.target.value)}
                                className="form-select"
                                required
                                disabled={!selectedDeptForUpdate}
                            >
                                <option value="">{selectedDeptForUpdate ? '-- Choose student --' : '-- Select department first --'}</option>
                                {filteredStudents.map((student) => (
                                    <option key={student.id} value={student.id}>
                                        {student.name} {student.admissionNumber ? `(${student.admissionNumber})` : ''} - {formatCurrency(student.amountPaid)}
                                    </option>
                                ))}
                            </select>
                            {selectedDeptForUpdate && filteredStudents.length === 0 && (
                                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                                    No students in this department
                                </p>
                            )}
                        </div>

                        {selectedStudentInfo && (
                            <div className="selected-student-info">
                                <span className="info-label">Name:</span>
                                <span className="info-value text-white">{selectedStudentInfo.name}</span>
                                <div className="w-full h-px bg-white/5 my-2"></div>
                                <span className="info-label">Department:</span>
                                <span className="info-value">{selectedStudentInfo.department.name}</span>
                                <div className="w-full h-px bg-white/5 my-2"></div>
                                <span className="info-label">Current Amount:</span>
                                <span className="info-value">{formatCurrency(selectedStudentInfo.amountPaid)}</span>
                            </div>
                        )}

                        <div className="form-group">
                            <label className="form-label">3. Add Amount (₹)</label>
                            <input
                                type="number"
                                required
                                min="1"
                                value={additionalAmount}
                                onChange={(e) => setAdditionalAmount(e.target.value)}
                                className="form-input"
                                placeholder="Enter amount to add"
                                disabled={!selectedStudent}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">4. Payment Details</label>

                            {/* Method Selector */}
                            <select
                                value={paymentMethod}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                className="form-select mb-2"
                                disabled={!selectedStudent}
                            >
                                {paymentMethods.map(method => (
                                    <option key={method} value={method}>{method}</option>
                                ))}
                            </select>

                            {/* Conditional Inputs */}
                            {["CAMPUS ACCOUNT", "SPECIAL ACCOUNT"].includes(paymentMethod) && (
                                <input
                                    type="text"
                                    value={transactionId}
                                    onChange={(e) => setTransactionId(e.target.value)}
                                    className="form-input"
                                    placeholder="Transaction Reference / Receipt No."
                                    disabled={!selectedStudent}
                                />
                            )}

                            {paymentMethod === "CASH ON HAND" && (
                                <input
                                    type="text"
                                    value={paymentNote}
                                    onChange={(e) => setPaymentNote(e.target.value)}
                                    className="form-input"
                                    placeholder="Add a note (optional)"
                                    disabled={!selectedStudent}
                                />
                            )}
                        </div>

                        <div className="form-group">
                            <label className="form-label">5. Attach Receipt (Optional)</label>
                            <div className={`border border-white/10 rounded-lg p-2 ${!selectedStudent ? 'opacity-50' : ''}`}>
                                <input
                                    type="file"
                                    onChange={(e) => setReceiptFile(e.target.files?.[0] || null)}
                                    className="text-xs w-full text-muted-foreground file:mr-4 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20"
                                    disabled={!selectedStudent}
                                />
                            </div>
                        </div>

                        {selectedStudentInfo && additionalAmount && (
                            <div className="new-total-preview mt-4">
                                <span>New Total:</span>
                                <span className="new-amount">
                                    {formatCurrency(selectedStudentInfo.amountPaid + Number(additionalAmount))}
                                </span>
                            </div>
                        )}

                        <button type="submit" className="form-btn success" disabled={updateLoading || !selectedStudent}>
                            <Check size={18} />
                            {updateLoading ? "Updating..." : "Update Payment"}
                        </button>

                        {updateMessage && (
                            <div className={`form-message ${updateMessage.includes('Error') ? 'error' : 'success'}`}>
                                {updateMessage}
                            </div>
                        )}
                    </form>
                </motion.div>

                {/* Add Department Form */}
                <motion.div
                    className="admin-card"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <div className="admin-card-header">
                        <div className="admin-card-icon" style={{ background: 'rgba(33, 150, 243, 0.1)', color: '#2196f3' }}>
                            <Building2 size={20} />
                        </div>
                        <h2 className="admin-card-title">Add Department</h2>
                    </div>

                    <form onSubmit={handleDeptSubmit} className="admin-form">
                        <div className="form-group">
                            <label className="form-label">Department Name</label>
                            <input
                                type="text"
                                required
                                value={deptName}
                                onChange={(e) => setDeptName(e.target.value)}
                                className="form-input"
                                placeholder="e.g., Computer Science"
                            />
                        </div>

                        <button type="submit" className="form-btn primary" disabled={deptLoading}>
                            <Plus size={18} />
                            {deptLoading ? "Adding..." : "Add Department"}
                        </button>

                        {deptMessage && (
                            <div className={`form-message ${deptMessage.includes('Error') ? 'error' : 'success'}`}>
                                {deptMessage}
                            </div>
                        )}
                    </form>

                    {/* Department List */}
                    <div className="dept-list">
                        <h3 className="dept-list-title">Current Departments</h3>
                        {departments.map((dept) => (
                            <div key={dept.id} className="dept-item">
                                <span className="dept-item-name">{dept.name}</span>
                                <span className="dept-item-count">{dept._count?.students || 0}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Recent Students */}
            <motion.div
                className="admin-card"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >
                <div className="admin-card-header">
                    <div className="admin-card-icon" style={{ background: 'rgba(255, 152, 0, 0.1)', color: '#ff9800' }}>
                        <Clock size={20} />
                    </div>
                    <h2 className="admin-card-title">All Students</h2>
                </div>

                <div className="recent-list">
                    {recentStudents.map((student) => (
                        <div key={student.id} className="recent-item">
                            <div className="recent-info">
                                <span className="recent-name">
                                    {student.name}
                                    {student.admissionNumber && <span className="text-sm text-gray-500 ml-2">({student.admissionNumber})</span>}
                                </span>
                                <span className="recent-dept">{student.department.name}</span>
                            </div>
                            <span className="recent-amount">{formatCurrency(student.amountPaid)}</span>
                        </div>
                    ))}
                    {recentStudents.length === 0 && (
                        <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '24px' }}>
                            No students yet
                        </p>
                    )}
                </div>
            </motion.div>
        </main>
    );
}
