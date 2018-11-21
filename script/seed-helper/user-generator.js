const names = [
  'Aaren',
  'Aarika',
  'Abagael',
  'Abagail',
  'Abbe',
  'Abbey',
  'Abbi',
  'Abbie',
  'Abby',
  'Abbye',
  'Abigael',
  'Abigail',
  'Abigale',
  'Abra',
  'Ada',
  'Adah',
  'Adaline',
  'Adan',
  'Adara',
  'Adda',
  'Addi',
  'Addia',
  'Addie',
  'Addy',
  'Adel',
  'Adela',
  'Adelaida',
  'Adelaide',
  'Adele',
  'Adelheid',
  'Adelice',
  'Adelina',
  'Adelind',
  'Adeline',
  'Adella',
  'Adelle',
  'Adena',
  'Adey',
  'Adi',
  'Adiana',
  'Adina',
  'Adora'
]

const password = '123'
const phone = '123-456-7890'
const emails = names.map(name => name.concat('@email.com'))

const users = names.map((name, i) => ({
  name,
  password,
  phone,
  email: emails[i]
}))

module.exports = users
