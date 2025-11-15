export function verifyAccess(expectedRole) {
  const token = localStorage.getItem('ms_token');
  const role = localStorage.getItem('ms_role');
  if (!token) {
    window.location.href = '../MSA_Login/index.html';
    return;
  }
  if (expectedRole && role !== expectedRole) {
    alert('Access denied');
    window.location.href = '../MSA_Login/index.html';
  }
}
