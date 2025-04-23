import React, { useState } from 'react';

const UserProfile = () => {
    const [user, setUser] = useState({
        firstName: 'John',
        lastName: 'Doe',
        phone: '123-456-7890',
        email: 'john.doe@example.com',
        avatar: '/avatars/default-avatar.jpg',
        hireDate: '2023-01-15',
        position: 'Software Engineer',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    };

    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4">User Profile</h2>
            <div className="row">
                <div className="col-md-4 text-center">
                    <img
                        src={user.avatar}
                        alt="User Avatar"
                        className="img-fluid rounded-circle mb-3"
                        style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                    />
                    <input
                        type="file"
                        className="form-control"
                        onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                                const reader = new FileReader();
                                reader.onload = () => {
                                    setUser({ ...user, avatar: reader.result });
                                };
                                reader.readAsDataURL(file);
                            }
                        }}
                    />
                </div>
                <div className="col-md-8">
                    <form>
                        <div className="mb-3">
                            <label htmlFor="firstName" className="form-label">First Name</label>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                className="form-control"
                                value={user.firstName}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="lastName" className="form-label">Last Name</label>
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                className="form-control"
                                value={user.lastName}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="phone" className="form-label">Phone Number</label>
                            <input
                                type="text"
                                id="phone"
                                name="phone"
                                className="form-control"
                                value={user.phone}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className="form-control"
                                value={user.email}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="hireDate" className="form-label">Hire Date</label>
                            <input
                                type="date"
                                id="hireDate"
                                name="hireDate"
                                className="form-control"
                                value={user.hireDate}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="position" className="form-label">Position</label>
                            <input
                                type="text"
                                id="position"
                                name="position"
                                className="form-control"
                                value={user.position}
                                onChange={handleChange}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary w-100">Save Changes</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;