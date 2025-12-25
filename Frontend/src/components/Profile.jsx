import "../styles/profile.css";

function Profile() {
  return (
    <div>
      <center>
      <form>
        <table>
          <tbody>
            <tr>
              <td>Name</td>
              <td><input type="text" /></td>
            </tr>
            <tr>
              <td>Email id</td>
              <td><input type="email" /></td>
            </tr>
            <tr>
              <td>Monthly income</td>
              <td><input type="number" /></td>
            </tr>
            <tr>
              <td>Monthly Savings</td>
              <td><input type="number" /></td>
            </tr>
            <tr>
              <td>Mode of payment</td>
              <td>
                <select name="" id="">
                  <option value="cash">Cash</option>
                  <option value="card">Card</option>
                  <option value="upi">UPI</option>
                </select>
              </td>
            </tr>
          </tbody>
        </table>
      </form>
      <button>cancel</button>
      <button>save</button>
      </center>
    </div>
  );
}

export default Profile;
