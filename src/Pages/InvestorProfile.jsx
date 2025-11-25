import { useState } from 'react';
import './InvestorProfile.css';

export default function InvestorProfile() {
  const [profileData, setProfileData] = useState({
    fullName: 'John Investor',
    email: 'john@investor.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    investmentRange: { min: 10000, max: 100000 },
    interests: ['AI/Tech', 'Green Tech', 'Blockchain'],
    industry: 'Finance',
    yearsExperience: 10,
    bio: 'Experienced angel investor with focus on emerging technologies and sustainable businesses.',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(profileData);

  const allInterests = [
    'AI/Tech',
    'Green Tech',
    'Blockchain',
    'Healthcare',
    'Education',
    'E-commerce',
    'SaaS',
    'Fintech',
    'Real Estate',
    'Manufacturing'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleRangeChange = (e, type) => {
    setFormData({
      ...formData,
      investmentRange: {
        ...formData.investmentRange,
        [type]: parseInt(e.target.value)
      }
    });
  };

  const toggleInterest = (interest) => {
    const updatedInterests = formData.interests.includes(interest)
      ? formData.interests.filter(i => i !== interest)
      : [...formData.interests, interest];
    setFormData({
      ...formData,
      interests: updatedInterests
    });
  };

  const handleSave = () => {
    setProfileData(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(profileData);
    setIsEditing(false);
  };

  return (
    <div className="investor-profile">
      <header className="profile-header">
        <h1>Investor Profile</h1>
        <p>Manage your investment preferences and profile information</p>
      </header>

      {/* Profile Card */}
      <section className="profile-section">
        <div className="profile-card">
          <div className="profile-avatar">
            <span>{profileData.fullName.charAt(0)}</span>
          </div>
          <div className="profile-info">
            <h2>{profileData.fullName}</h2>
            <p className="role">Angel Investor</p>
            <p className="location">📍 {profileData.location}</p>
          </div>
          {!isEditing && (
            <button 
              className="btn btn-edit"
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </button>
          )}
        </div>
      </section>

      {!isEditing ? (
        // View Mode
        <>
          {/* Investment Criteria */}
          <section className="criteria-section">
            <h2>Investment Criteria</h2>
            <div className="criteria-grid">
              <div className="criteria-card">
                <h3>Investment Range</h3>
                <p className="criteria-value">
                  ${(profileData.investmentRange.min / 1000).toFixed(0)}K - ${(profileData.investmentRange.max / 1000).toFixed(0)}K
                </p>
              </div>
              <div className="criteria-card">
                <h3>Experience</h3>
                <p className="criteria-value">{profileData.yearsExperience} years</p>
              </div>
              <div className="criteria-card">
                <h3>Industry Background</h3>
                <p className="criteria-value">{profileData.industry}</p>
              </div>
            </div>
          </section>

          {/* Interests */}
          <section className="interests-section">
            <h2>Investment Interests</h2>
            <div className="interests-grid">
              {profileData.interests.map(interest => (
                <span key={interest} className="interest-tag">{interest}</span>
              ))}
            </div>
          </section>

          {/* Contact Info */}
          <section className="contact-section">
            <h2>Contact Information</h2>
            <div className="contact-info">
              <div className="info-item">
                <label>Email</label>
                <p>{profileData.email}</p>
              </div>
              <div className="info-item">
                <label>Phone</label>
                <p>{profileData.phone}</p>
              </div>
              <div className="info-item">
                <label>Location</label>
                <p>{profileData.location}</p>
              </div>
            </div>
          </section>

          {/* Bio */}
          <section className="bio-section">
            <h2>About</h2>
            <p className="bio-text">{profileData.bio}</p>
          </section>
        </>
      ) : (
        // Edit Mode
        <section className="edit-section">
          <h2>Edit Profile</h2>
          <form className="edit-form">
            {/* Personal Info */}
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  name="location"
                  placeholder="City, State"
                  value={formData.location}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Industry Background</label>
                <input
                  type="text"
                  name="industry"
                  value={formData.industry}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Investment Range */}
            <div className="form-group">
              <label>Investment Range</label>
              <div className="range-inputs">
                <div className="range-item">
                  <label>Minimum</label>
                  <input
                    type="number"
                    value={formData.investmentRange.min}
                    onChange={(e) => handleRangeChange(e, 'min')}
                    step="1000"
                  />
                </div>
                <span className="range-separator">to</span>
                <div className="range-item">
                  <label>Maximum</label>
                  <input
                    type="number"
                    value={formData.investmentRange.max}
                    onChange={(e) => handleRangeChange(e, 'max')}
                    step="1000"
                  />
                </div>
              </div>
            </div>

            {/* Years of Experience */}
            <div className="form-group">
              <label>Years of Investment Experience</label>
              <input
                type="number"
                name="yearsExperience"
                value={formData.yearsExperience}
                onChange={handleInputChange}
                min="0"
                max="50"
              />
            </div>

            {/* Interests */}
            <div className="form-group">
              <label>Investment Interests</label>
              <div className="interests-checkboxes">
                {allInterests.map(interest => (
                  <label key={interest} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.interests.includes(interest)}
                      onChange={() => toggleInterest(interest)}
                    />
                    {interest}
                  </label>
                ))}
              </div>
            </div>

            {/* Bio */}
            <div className="form-group">
              <label>About You</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                rows="4"
                placeholder="Tell us about your investment experience and focus areas..."
              />
            </div>

            {/* Buttons */}
            <div className="form-actions">
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSave}
              >
                Save Changes
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      )}
    </div>
  );
}
