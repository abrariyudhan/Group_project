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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12">
            <div className="container mx-auto px-6 max-w-4xl">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-2">
                        Create New Project
                    </h1>
                    <p className="text-gray-600 text-lg">Set up a new project with tasks and activities</p>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Project Name */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Project Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                placeholder="Enter project name"
                                required
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Description <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                name="description"
                                rows="4"
                                value={formData.description}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
                                placeholder="Describe your project"
                                required
                            />
                        </div>

                        {/* Activities/Tasks */}
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <label className="block text-sm font-semibold text-gray-700">
                                    Activities/Tasks
                                </label>
                                <button
                                    type="button"
                                    onClick={addActivity}
                                    className="bg-gradient-to-r from-green-500 to-green-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:from-green-600 hover:to-green-700 transition shadow-sm hover:shadow-md flex items-center gap-1"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    Add Activity
                                </button>
                            </div>

                            <div className="space-y-3">
                                {formData.activities.map((activity, index) => (
                                    <div key={index} className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder={`Activity ${index + 1}`}
                                            value={activity}
                                            onChange={(e) => handleActivityChange(index, e.target.value)}
                                            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeActivity(index)}
                                            disabled={formData.activities.length === 1}
                                            className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2.5 rounded-lg hover:from-red-600 hover:to-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                                            title="Remove activity"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-3 pt-4">
                            <button
                                type="submit"
                                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition shadow-md hover:shadow-lg transform hover:scale-105"
                            >
                                Create Project
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate('/')}
                                className="px-6 bg-gray-100 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-200 transition"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}