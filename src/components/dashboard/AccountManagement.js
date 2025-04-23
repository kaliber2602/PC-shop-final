import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const AccountManagement = () => {
    // Mock data for accounts
    const [accounts, setAccounts] = useState([
        { id: 1, name: "Admin1", email: "admin1@example.com", role: true, status: "Active" },
        { id: 2, name: "User1", email: "user1@example.com", role: false, status: "Inactive" },
        { id: 3, name: "Admin2", email: "admin2@example.com", role: true, status: "Active" },
        { id: 4, name: "User2", email: "user2@example.com", role: false, status: "Active" },
    ]);

    const [newAccount, setNewAccount] = useState({ name: "", email: "", role: false, status: "Active" });
    const [editingAccount, setEditingAccount] = useState(null);
    const [accountToDelete, setAccountToDelete] = useState(null); // State for account to delete
    const [searchQuery, setSearchQuery] = useState(""); // State for search query

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

    const handleSaveEdit = () => {
        setAccounts(accounts.map(acc => acc.id === editingAccount.id ? editingAccount : acc));
        setEditingAccount(null);
    };

    // Handle deleting an account
    const handleDeleteAccount = () => {
        setAccounts(accounts.filter(account => account.id !== accountToDelete.id));
        setAccountToDelete(null); // Close the delete confirmation modal
    };

    // Filter accounts based on search query
    const filteredAccounts = accounts.filter(
        (account) =>
            account.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            account.email.toLowerCase().includes(searchQuery.toLowerCase())
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
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAccounts.map((account) => (
                                <tr key={account.id}>
                                    <td>{account.id}</td>
                                    <td>{account.name}</td>
                                    <td>{account.email}</td>
                                    <td>{account.role ? "Admin" : "User"}</td>
                                    <td>{account.status}</td>
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
                                            placeholder="Name"
                                            value={editingAccount.name}
                                            onChange={(e) =>
                                                setEditingAccount({ ...editingAccount, name: e.target.value })
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
                                            value={editingAccount.role}
                                            onChange={(e) =>
                                                setEditingAccount({ ...editingAccount, role: e.target.value === "true" })
                                            }
                                        >
                                            <option value="false">User</option>
                                            <option value="true">Admin</option>
                                        </select>
                                        <select
                                            className="form-control"
                                            value={editingAccount.status}
                                            onChange={(e) =>
                                                setEditingAccount({ ...editingAccount, status: e.target.value })
                                            }
                                        >
                                            <option value="Active">Active</option>
                                            <option value="Inactive">Inactive</option>
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