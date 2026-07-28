/**
 * Servicio de Autenticación de Usuarios (Login Propio)
 * Manejo de sesiones, registro de cuentas y aislamiento de datos.
 * Estética Quiet Luxury estricta.
 */

class AuthService {
  constructor() {
    this.sessionKey = 'aura_active_session';
    this.usersKey = 'aura_users_registry';

    this.initRegistry();
  }

  initRegistry() {
    const registryStr = localStorage.getItem(this.usersKey);
    if (!registryStr) {
      // Cuenta predeterminada de inicio para Juan Soriano
      const defaultUsers = [
        {
          id: 'usr_default',
          email: 'juansoriano@fitexpert.app',
          name: 'Juan Soriano',
          passwordHash: 'aura2026',
          createdAt: new Date().toISOString()
        }
      ];
      localStorage.setItem(this.usersKey, JSON.stringify(defaultUsers));
    }

    // Inicializar sesión por defecto si no existe
    if (!localStorage.getItem(this.sessionKey)) {
      const users = this.getUsers();
      if (users.length > 0) {
        localStorage.setItem(this.sessionKey, JSON.stringify(users[0]));
      }
    }
  }

  getUsers() {
    try {
      return JSON.parse(localStorage.getItem(this.usersKey)) || [];
    } catch (e) {
      return [];
    }
  }

  getCurrentUser() {
    try {
      const sess = JSON.parse(localStorage.getItem(this.sessionKey));
      return sess || { id: 'usr_default', email: 'juansoriano@fitexpert.app', name: 'Juan Soriano' };
    } catch (e) {
      return { id: 'usr_default', email: 'juansoriano@fitexpert.app', name: 'Juan Soriano' };
    }
  }

  register(email, password, name) {
    if (!email || !password) {
      throw new Error('Email y contraseña obligatorios.');
    }

    const users = this.getUsers();
    const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      throw new Error('Ya existe una cuenta con este email.');
    }

    const newUser = {
      id: 'usr_' + Date.now(),
      email: email.toLowerCase().trim(),
      name: name || email.split('@')[0],
      passwordHash: password,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem(this.usersKey, JSON.stringify(users));
    localStorage.setItem(this.sessionKey, JSON.stringify(newUser));
    return newUser;
  }

  login(email, password) {
    if (!email || !password) {
      throw new Error('Ingresa email y contraseña.');
    }

    const users = this.getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
    if (!user) {
      throw new Error('Usuario no encontrado. Por favor regístrate.');
    }

    if (user.passwordHash !== password) {
      throw new Error('Contraseña incorrecta.');
    }

    localStorage.setItem(this.sessionKey, JSON.stringify(user));
    return user;
  }

  logout() {
    localStorage.removeItem(this.sessionKey);
  }
}

export const authService = new AuthService();
