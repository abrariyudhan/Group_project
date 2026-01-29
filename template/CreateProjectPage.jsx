import { useState } from 'react';
import { useNavigate } from 'react-router';
import http from '../helpers/http';

export default function CreateProjectPage() {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        activities: [''] // Array untuk menyimpan multiple activities
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleActivityChange = (index, value) => {
        const newActivities = [...formData.activities];
        newActivities[index] = value;
        setFormData({
            ...formData,
            activities: newActivities
        });
    };

    const addActivity = () => {
        setFormData({
            ...formData,
            activities: [...formData.activities, '']
        });
    };

    const removeActivity = (index) => {
        const newActivities = formData.activities.filter((_, i) => i !== index);
        setFormData({
            ...formData,
            activities: newActivities
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
              // PERBAIKAN: kirim formData sebagai body, bukan di config headers
            const response = await http.post('/projects', formData, {
                headers: {
                    authorization: `Bearer ${localStorage.getItem('access_token')}`
                }
            });

            // PERBAIKAN: http helper (axios) tidak pakai .ok, tapi cek status
            if (response.status === 201) {
                navigate('/projects');
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="container mt-5">
            <h1>Create New Project</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Project Name</label>
                    <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                        className="form-control"
                        name="description"
                        rows="4"
                        value={formData.description}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Activities/Tasks</label>
                    {formData.activities.map((activity, index) => (
                        <div key={index} className="input-group mb-2">
                            <input
                                type="text"
                                className="form-control"
                                placeholder={`Activity ${index + 1}`}
                                value={activity}
                                onChange={(e) => handleActivityChange(index, e.target.value)}
                            />
                            <button
                                type="button"
                                className="btn btn-danger"
                                onClick={() => removeActivity(index)}
                                disabled={formData.activities.length === 1}
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={addActivity}
                    >
                        + Add Activity
                    </button>
                </div>

                <button type="submit" className="btn btn-primary">
                    Create Project
                </button>
            </form>
        </div>
    );
}