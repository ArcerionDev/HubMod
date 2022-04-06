const prefix = require('../config.json').prefix

module.exports =  {
    meta: {
      name: "Samplepacks",
      id: "samplepacks",
      desc: `Purchase community made sample packs! Use ${"`"}${prefix}samplepacks / ${prefix}sp${"`"} for more details.`,
      displayCost: "Varied",
      cost: 0,
      amount: false,
    }
  }