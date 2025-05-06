export default function AuthPage() {
  return (
    <div>
      <form method="post" action="/api/auth">
        <label htmlFor="email">Email</label>
        <input id="email" name="email" required />

        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" required />

        <label htmlFor="role">Role</label>
        <select name="role" id="role">
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        <button>Daftar</button>
      </form>
    </div>
  );
}
