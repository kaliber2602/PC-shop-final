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

    const [newAccount, setNewAccount] = useState({
        first_name: "",
        last_name: "",
        user_name: "",
        phone_number: "",
        address: "",
        email: "",
        password: "",
        gender: "Male",
        admin: 0,
    });

    const [editingAccount, setEditingAccount] = useState(null);
    const [accountToDelete, setAccountToDelete] = useState(null);

    // Handle adding a new account
    const handleAddAccount = async () => {
        if (!newAccount.first_name || !newAccount.last_name || !newAccount.email || !newAccount.password) {
            alert("First Name, Last Name, Email, and Password are required!");
            return;
        }

        try {
            const response = await fetch("http://localhost/PC-shop-final-main/backend/addAccount.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newAccount),
            });

            const result = await response.json();
            if (result.success) {
                alert("Account added successfully!");
                fetchAccounts(); // Làm mới danh sách tài khoản
                setNewAccount({
                    first_name: "",
                    last_name: "",
                    user_name: "",
                    phone_number: "",
                    address: "",
                    email: "",
                    password: "",
                    gender: "Male",
                    admin: 0,
                });
            } else {
                alert("Failed to add account: " + result.error);
            }
        } catch (error) {
            console.error("Error adding account:", error);
            alert("An error occurred while adding the account.");
        }
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
                body: JSON.stringify(editingAccount),
            });

            const result = await response.json();
            if (result.success) {
                alert("Account updated successfully!");
                fetchAccounts(); // Làm mới danh sách tài khoản
                setEditingAccount(null);
            } else {
                alert("Failed to update account: " + result.error);
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
                    setAccounts(accounts.filter(account => account.id !== accountToDelete.id));
                    setAccountToDelete(null);
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
                                placeholder="First Name"
                                value={newAccount.first_name}
                                onChange={(e) => setNewAccount({ ...newAccount, first_name: e.target.value })}
                            />
                        </div>
                        <div className="col-md-3">
                            <input
                                type="text"
                                className="form-control p-3"
                                placeholder="Last Name"
                                value={newAccount.last_name}
                                onChange={(e) => setNewAccount({ ...newAccount, last_name: e.target.value })}
                            />
                        </div>
                        <div className="col-md-3">
                            <input
                                type="text"
                                className="form-control p-3"
                                placeholder="User Name"
                                value={newAccount.user_name}
                                onChange={(e) => setNewAccount({ ...newAccount, user_name: e.target.value })}
                            />
                        </div>
                        <div className="col-md-3">
                            <input
                                type="text"
                                className="form-control p-3"
                                placeholder="Phone Number"
                                value={newAccount.phone_number}
                                onChange={(e) => setNewAccount({ ...newAccount, phone_number: e.target.value })}
                            />
                        </div>
                        <div className="col-md-6">
                            <input
                                type="text"
                                className="form-control p-3"
                                placeholder="Address"
                                value={newAccount.address}
                                onChange={(e) => setNewAccount({ ...newAccount, address: e.target.value })}
                            />
                        </div>
                        <div className="col-md-6">
                            <input
                                type="email"
                                className="form-control p-3"
                                placeholder="Email"
                                value={newAccount.email}
                                onChange={(e) => setNewAccount({ ...newAccount, email: e.target.value })}
                            />
                        </div>
                        <div className="col-md-6">
                            <input
                                type="password"
                                className="form-control p-3"
                                placeholder="Password"
                                value={newAccount.password}
                                onChange={(e) => setNewAccount({ ...newAccount, password: e.target.value })}
                            />
                        </div>
                        <div className="col-md-3">
                            <select
                                className="form-control p-3"
                                value={newAccount.gender}
                                onChange={(e) => setNewAccount({ ...newAccount, gender: e.target.value })}
                            >
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </div>
                        <div className="col-md-3">
                            <select
                                className="form-control p-3"
                                value={newAccount.admin}
                                onChange={(e) => setNewAccount({ ...newAccount, admin: parseInt(e.target.value) })}
                            >
                                <option value={0}>User</option>
                                <option value={1}>Admin</option>
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
                                    <td>{account.first_name}</td>
                                    <td>{account.last_name}</td>
                                    <td>{account.email}</td>
                                    <td>{account.role === 1 ? "Admin" : "User"}</td>
                                    <td>
                                        <button
                                            className="btn btn-warning btn-sm me-2 p-3"
                                            onClick={() => handleEditAccount(account)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="btn btn-danger btn-sm p-3"
                                            onClick={() => setAccountToDelete(account)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit Modal */}
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
                                    value={editingAccount.role === 1 ? "1" : "0"} 
                                    onChange={(e) =>
                                        setEditingAccount({ ...editingAccount, role: e.target.value === "1" })
                                    }
                                >
                                    <option value="0">User</option>
                                    <option value="1">Admin</option>
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
                        backgroundColor: "rgba(0,0,0,0.5)",
                        width: "100vw",
                        height: "25vh",
                        zIndex: 1050,
                    }}
                >
                    <div className="modal-dialog" style={{ maxWidth: "500px", width: "100%" }}>
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Delete Account</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setAccountToDelete(null)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                Are you sure you want to delete the account "{accountToDelete.first_name} {accountToDelete.last_name}"?
                            </div>
                            <div className="modal-footer">
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => setAccountToDelete(null)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="btn btn-danger"
                                    onClick={handleDeleteAccount}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AccountManagement;