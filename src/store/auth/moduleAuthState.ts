const moduleAuthState = {
    user: undefined,
    users: {},
    permissions: {},
    permissionLevels: [
        { text: 'Observer', value: 'observer' },
        { text: 'Standard', value: 'standard' },
        { text: 'Manager', value: 'manager' },
        { text: 'Power User', value: 'poweruser' },
        { text: 'Admin', value: 'admin' },
    ],
    minPasswordLength: 10,
    forceLogout: false,
};

export default moduleAuthState;
