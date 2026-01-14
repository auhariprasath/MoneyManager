import { useEffect, useState } from "react";
import "../styles/profile.css";

function Profile() {
  const defaults = {
    name: "Brijesh M",
    email: "brijeshmathimariappan1@gmail.com",
    profile: {
      age: 20,
      occupation: "Backend Developer",
      monthlyIncome: 2000
    }
  };

  const [user, setUser] = useState(defaults);
  const [originalUser, setOriginalUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetch("http://localhost:8080/user/me")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch profile");
        return res.json();
      })
      .then((data) => {
        // normalize shape — ensure profile object exists
        const normalized = {
          name: data.name || defaults.name,
          email: data.email || defaults.email,
          profile: {
            age: data.profile?.age ?? defaults.profile.age,
            occupation: data.profile?.occupation || defaults.profile.occupation,
            monthlyIncome: data.profile?.monthlyIncome ?? defaults.profile.monthlyIncome
          }
        };
        setUser(normalized);
        setOriginalUser(normalized);
        setLoading(false);
      })
      .catch((err) => {
        // keep defaults if fetch fails
        console.error(err);
        setUser(defaults);
        setOriginalUser(defaults);
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "age" || name === "monthlyIncome") {
      const num = value === "" ? "" : Number(value);
      setUser((u) => ({ ...u, profile: { ...u.profile, [name]: num } }));
    } else if (name === "occupation") {
      setUser((u) => ({ ...u, profile: { ...u.profile, occupation: value } }));
    } else if (name === "name" || name === "email") {
      setUser((u) => ({ ...u, [name]: value }));
    }
  };

  const handleSave = async () => {
    try {
      const body = {
        name: user.name,
        email: user.email,
        profile: {
          age: user.profile.age,
          occupation: user.profile.occupation,
          monthlyIncome: user.profile.monthlyIncome
        }
      };

      const res = await fetch("http://localhost:8080/user/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      if (!res.ok) throw new Error("Update failed");

      const updated = await res.json();
      const normalized = {
        name: updated.name || body.name,
        email: updated.email || body.email,
        profile: {
          age: updated.profile?.age ?? body.profile.age,
          occupation: updated.profile?.occupation || body.profile.occupation,
          monthlyIncome: updated.profile?.monthlyIncome ?? body.profile.monthlyIncome
        }
      };
      setUser(normalized);
      setOriginalUser(normalized);
      setIsEditing(false);
      alert("Profile updated successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to update profile");
    }
  };

  const handleCancel = () => {
    if (originalUser) setUser(originalUser);
    setIsEditing(false);
  };

  if (loading) return <h3 style={{ textAlign: "center" }}>Loading...</h3>;

  return (
    <div>
      <center>
        <h2>My Profile</h2>

        <table className="profile-table">
          <tbody>
            <tr>
              <td>Name</td>
              <td>
                {isEditing ? (
                  <input name="name" value={user.name} onChange={handleChange} />
                ) : (
                  user.name
                )}
              </td>
            </tr>

            <tr>
              <td>Email</td>
              <td>
                {isEditing ? (
                  <input name="email" value={user.email} onChange={handleChange} />
                ) : (
                  user.email
                )}
              </td>
            </tr>

            <tr>
              <td>Age</td>
              <td>
                {isEditing ? (
                  <input name="age" type="number" value={user.profile.age} onChange={handleChange} />
                ) : (
                  user.profile.age
                )}
              </td>
            </tr>

            <tr>
              <td>Occupation</td>
              <td>
                {isEditing ? (
                  <input name="occupation" value={user.profile.occupation} onChange={handleChange} />
                ) : (
                  user.profile.occupation
                )}
              </td>
            </tr>

            <tr>
              <td>Monthly Income</td>
              <td>
                {isEditing ? (
                  <input name="monthlyIncome" type="number" value={user.profile.monthlyIncome} onChange={handleChange} />
                ) : (
                  user.profile.monthlyIncome
                )}
              </td>
            </tr>
          </tbody>
        </table>

        <div style={{ marginTop: 12 }}>
          {!isEditing ? (
            <>
              <button onClick={() => setIsEditing(true)}>Edit</button>
            </>
          ) : (
            <>
              <button onClick={handleCancel}>Cancel</button>
              <button onClick={handleSave}>Save</button>
            </>
          )}
        </div>
      </center>
    </div>
  );
}

export default Profile;
