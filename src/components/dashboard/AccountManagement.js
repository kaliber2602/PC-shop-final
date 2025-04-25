import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const AccountManagement = () => {
    const [accounts, setAccounts] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchAccounts = async () => {
        try {
            const response = await fetch("http://localhost/PC-shop-final-main/backend/getAccounts.php");
            if (!response.ok) throw new Error("Failed to fetch accounts");
            const data = await response.json();
            setAccounts(data);
        } catch (error) {
            console.error("Error fetching accounts:", error);
        }
    };

    useEffect(() => {
        fetchAccounts();
    }, []);
    
    const [newAccount, setNewAccount] = useState({ first_name: "", last_name: "", email: "", role: false });
    const [editingAccount, setEditingAccount] = useState(null);
    const [accountToDelete, setAccountToDelete] = useState(null); // State for account to delete
    

    // Handle adding a new account
    const handleAddAccount = () => {
        if (!newAccount.name || !newAccount.email) {
            alert("Name and Email are required!");
            return;
        }
        setAccounts([...accounts, { ...newAccount, id: accounts.length + 1 }]);
        setNewAccount({ name: "", email: "", role: false, status: "Active" });
    };

    // Handle editing an account
    const handleEditAccount = (account) => {
        setEditingAccount(account);
    };

    const handleSaveEdit = async () => {
        try {
            const response = await fetch("http://localhost/PC-shop-final-main/backend/updateAccount.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: editingAccount.id,
                    first_name: editingAccount.first_name,
                    last_name: editingAccount.last_name,
                    email: editingAccount.email,
                    role: editingAccount.role ? 1 : 0,
                }),
            });
    
            if (!response.ok) throw new Error("Failed to update account");
    
            const result = await response.json();
            if (result.success) {
                setAccounts(accounts.map(acc => acc.id === editingAccount.id ? editingAccount : acc));
                setEditingAccount(null);
            } else {
                console.error("Error updating account:", result.error);
            }
        } catch (error) {
            console.error("Error saving changes:", error);
        }
    };
    // Handle deleting an account
    const handleDeleteAccount = async () => {
        if (window.confirm(`Are you sure you want to delete the account "${accountToDelete.first_name} ${accountToDelete.last_name}"?`)) {
            try {
                const response = await fetch("http://localhost/PC-shop-final-main/backend/deleteAccount.php", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ id: accountToDelete.id }),
                });
    
                const result = await response.json();
                if (result.success) {
                    alert("Account deleted successfully!");
                    setAccounts(accounts.filter(account => account.id !== accountToDelete.id)); // Cập nhật danh sách tài khoản
                    setAccountToDelete(null); // Đóng modal xác nhận xóa
                } else {
                    alert("Failed to delete account: " + result.error);
                }
            } catch (error) {
                console.error("Error deleting account:", error);
                alert("An error occurred while deleting the account.");
            }
        }
    };

    // Filter accounts based on search query
    const filteredAccounts = accounts.filter(
        (account) =>
            `${account.first_name} ${account.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (account.email && account.email.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="col-12">
            <div className="card">
                <div className="card-header bg-primary text-white text-center">
                    <h2 className="mb-0">Account Management</h2>
                </div>
                <div className="card-body">
                    {/* Search Bar */}
                    <div className="row mb-3">
                        <div className="col-md-6 offset-md-3">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search by Name or Email"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Add New Account Form */}
                    <h4>Add New Account</h4>
                    <div className="row mb-3 p-3">
                        <div className="col-md-3">
                            <input
                                type="text"
                                className="form-control p-3"
                                placeholder="Name"
                                value={newAccount.name}
                                onChange={(e) => setNewAccount({ ...newAccount, name: e.target.value })}
                            />
                        </div>
                        <div className="col-md-3">
                            <input
                                type="email"
                                className="form-control p-3"
                                placeholder="Email"
                                value={newAccount.email}
                                onChange={(e) => setNewAccount({ ...newAccount, email: e.target.value })}
                            />
                        </div>
                        <div className="col-md-2">
                            <select
                                className="form-control p-3 "
                                value={newAccount.role}
                                onChange={(e) => setNewAccount({ ...newAccount, role: e.target.value === "true" })}
                            >
                                <option value="false">User</option>
                                <option value="true">Admin</option>
                            </select>
                        </div>
                        <div className="col-md-2">
                            <select
                                className="form-control p-3"
                                value={newAccount.status}
                                onChange={(e) => setNewAccount({ ...newAccount, status: e.target.value })}
                            >
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </div>
                        <div className="col-md-2">
                            <button className="btn btn-success w-100 p-3" onClick={handleAddAccount}>
                                Add Account
                            </button>
                        </div>
                    </div>

                    {/* Account Table */}
                    <h4>Account List</h4>
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>First_name</th>
                                <th>Last_name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Active</th>
                                
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAccounts.map((account) => (
                                <tr key={account.id}>
                                    <td>{account.id}</td>
                                    <td>{account.first_name}</td> {/* Ô riêng cho First Name */}
                                    <td>{account.last_name}</td>  {/* Ô riêng cho Last Name */}
                                    <td>{account.email}</td>
                                    <td>{account.role ? "Admin" : "User"}</td>
                                    <td>
                                        <button
                                            className="btn btn-warning btn-sm me-2 p-3"
                                            onClick={() => handleEditAccount(account)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="btn btn-danger btn-sm p-3"
                                            onClick={() => setAccountToDelete(account)} // Open delete confirmation modal
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Edit Account Modal */}
                    {editingAccount && (
                        <div
                            className="modal show d-block"
                            tabIndex="-1"
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                position: "fixed",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                                width: "100vw",
                                height: "40%",
                                zIndex: 1050,
                            }}
                        >
                            <div className="modal-dialog" style={{ maxWidth: "500px", width: "100%" }}>
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title">Edit Account</h5>
                                        <button
                                            type="button"
                                            className="btn-close"
                                            onClick={() => setEditingAccount(null)}
                                        ></button>
                                    </div>
                                    <div className="modal-body">
                                    <input
                                        type="text"
                                        className="form-control mb-2"
                                        placeholder="First Name"
                                        value={editingAccount.first_name}
                                        onChange={(e) =>
                                            setEditingAccount({ ...editingAccount, first_name: e.target.value })
                                        }
                                    />
                                    <input
                                        type="text"
                                        className="form-control mb-2"
                                        placeholder="Last Name"
                                        value={editingAccount.last_name}
                                        onChange={(e) =>
                                            setEditingAccount({ ...editingAccount, last_name: e.target.value })
                                        }
                                    />
                                    <input
                                        type="email"
                                        className="form-control mb-2"
                                        placeholder="Email"
                                        value={editingAccount.email}
                                        onChange={(e) =>
                                            setEditingAccount({ ...editingAccount, email: e.target.value })
                                        }
                                    />
                                    <select
                                        className="form-control mb-2"
                                        value={editingAccount.role ? "true" : "false"} // Hiển thị giá trị hiện tại
                                        onChange={(e) =>
                                            setEditingAccount({ ...editingAccount, role: e.target.value === "true" })
                                        }
                                    >
                                        <option value="false">User</option>
                                        <option value="true">Admin</option>
                                    </select>
                                    </div>
                                    <div className="modal-footer">
                                        <button
                                            className="btn btn-secondary"
                                            onClick={() => setEditingAccount(null)}
                                        >
                                            Cancel
                                        </button>
                                        <button className="btn btn-primary" onClick={handleSaveEdit}>
                                            Save Changes
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Delete Confirmation Modal */}
                    {accountToDelete && (
                        <div
                            className="modal show d-block"
                            tabIndex="-1"
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                position: "fixed",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                                width: "100vw",
                                padding: "0 0",
                                margin: "0 0",
                                height: "25%",
                                zIndex: 1050,
                            }}
                        >
                            <div className="modal-dialog" style={{ maxWidth: "400px", width: "100%" }}>
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title">Confirm Delete</h5>
                                        <button
                                            type="button"
                                            className="btn-close"
                                            onClick={() => setAccountToDelete(null)}
                                        ></button>
                                    </div>
                                    <div className="modal-body">
                                        <p>Are you sure you want to delete the account "{accountToDelete.name}"?</p>
                                    </div>
                                    <div className="modal-footer">
                                        <button
                                            className="btn btn-secondary"
                                            onClick={() => setAccountToDelete(null)}
                                        >
                                            Cancel
                                        </button>
                                        <button className="btn btn-danger" onClick={handleDeleteAccount}>
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AccountManagement;