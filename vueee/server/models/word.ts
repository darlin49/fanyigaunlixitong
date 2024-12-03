import { DataTypes } from 'sequelize'
import sequelize from '../config/database'

const Word = sequelize.define('Word', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  word: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phonetic: {
    type: DataTypes.STRING
  },
  definition: {
    type: DataTypes.TEXT
  },
  example: {
    type: DataTypes.TEXT
  }
})

export default Word