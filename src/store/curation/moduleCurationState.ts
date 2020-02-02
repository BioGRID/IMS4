const moduleCurationState = {
    curationGroups: {},
    currentDataset: {},
    datasetCollapsed: false,
    datasetDrawerLinks: [
        {
            to: '/admin/user/useradd',
            icon: 'mdi-ab-testing',
            text: 'View Dataset',
            subtitle: 'Pubmed: 12345678',
        },
        {
            to: '/admin/user/changemypassword',
            icon: 'mdi-account-cash-outline',
            text: 'Change Password',
            subtitle: '2011 active',
        },
        {
            to: '/admin/socket/socketstatus',
            icon: 'mdi-airplane-takeoff',
            text: 'Socket Status',
        },
    ],
};

export default moduleCurationState;
