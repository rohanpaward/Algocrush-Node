const { headerValidator } = require('./onboarding.validation');

const fetchRolesOptions = {
  tags: ['api', 'Systems'],
  description: 'Fetch System API',
  validate: {
   // headers: headerValidator,
  //  query: queryValidator,
    failAction: async (request, h, err) => {
      throw err;
    },
  },
};

module.exports ={
    fetchRolesOptions
}