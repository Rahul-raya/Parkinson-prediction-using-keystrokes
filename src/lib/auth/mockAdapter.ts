interface User {
  name: string;
  email: string;
  provider: 'google' | 'microsoft' | 'apple' | 'email';
  token: string;
}

export interface AuthAdapter {
  loginWithGoogle(): Promise<User>;
  loginWithMicrosoft(): Promise<User>;
  loginWithApple(): Promise<User>;
  loginWithEmail(name: string, email: string): Promise<User>;
  logout(): Promise<void>;
}

const generateMockToken = (provider: string): string => {
  return `mock_${provider}_${Math.random().toString(36).substr(2, 9)}`;
};

const simulateOAuthPopup = async (provider: string): Promise<User> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return {
    name: `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`,
    email: `user@${provider}.com`,
    provider: provider as User['provider'],
    token: generateMockToken(provider)
  };
};

export class MockAuthAdapter implements AuthAdapter {
  async loginWithGoogle(): Promise<User> {
    return simulateOAuthPopup('google');
  }

  async loginWithMicrosoft(): Promise<User> {
    return simulateOAuthPopup('microsoft');
  }

  async loginWithApple(): Promise<User> {
    return simulateOAuthPopup('apple');
  }

  async loginWithEmail(name: string, email: string): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      name,
      email,
      provider: 'email',
      token: generateMockToken('email')
    };
  }

  async logout(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
  }
}

export const authAdapter = new MockAuthAdapter();
