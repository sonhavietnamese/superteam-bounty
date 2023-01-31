export type Flexin = {
  version: '0.1.0'
  name: 'flexin'
  constants: [
    {
      name: 'PROFILE_TAG'
      type: 'bytes'
      value: '[80, 82, 79, 70, 73, 76, 69]'
    },
    {
      name: 'EMPTY_STRING'
      type: 'string'
      value: '"EMPTY_STRING"'
    },
  ]
  instructions: [
    {
      name: 'createProfile'
      accounts: [
        {
          name: 'profile'
          isMut: true
          isSigner: false
        },
        {
          name: 'signer'
          isMut: true
          isSigner: true
        },
        {
          name: 'systemProgram'
          isMut: false
          isSigner: false
        },
      ]
      args: [
        {
          name: 'username'
          type: 'string'
        },
        {
          name: 'twitter'
          type: 'string'
        },
        {
          name: 'telegram'
          type: 'string'
        },
        {
          name: 'discord'
          type: 'string'
        },
        {
          name: 'github'
          type: 'string'
        },
        {
          name: 'linkedin'
          type: 'string'
        },
      ]
    },
    {
      name: 'updateProfile'
      accounts: [
        {
          name: 'profile'
          isMut: true
          isSigner: false
        },
        {
          name: 'signer'
          isMut: true
          isSigner: true
        },
        {
          name: 'systemProgram'
          isMut: false
          isSigner: false
        },
      ]
      args: [
        {
          name: 'username'
          type: 'string'
        },
        {
          name: 'twitter'
          type: 'string'
        },
        {
          name: 'telegram'
          type: 'string'
        },
        {
          name: 'linkedin'
          type: 'string'
        },
        {
          name: 'discord'
          type: 'string'
        },
        {
          name: 'github'
          type: 'string'
        },
      ]
    },
    {
      name: 'mintNft'
      accounts: [
        {
          name: 'mintAuthority'
          isMut: true
          isSigner: true
        },
        {
          name: 'mint'
          isMut: true
          isSigner: false
        },
        {
          name: 'tokenProgram'
          isMut: false
          isSigner: false
        },
        {
          name: 'metadata'
          isMut: true
          isSigner: false
        },
        {
          name: 'tokenAccount'
          isMut: true
          isSigner: false
        },
        {
          name: 'tokenMetadataProgram'
          isMut: false
          isSigner: false
        },
        {
          name: 'payer'
          isMut: true
          isSigner: false
        },
        {
          name: 'systemProgram'
          isMut: false
          isSigner: false
        },
        {
          name: 'rent'
          isMut: false
          isSigner: false
        },
        {
          name: 'masterEdition'
          isMut: true
          isSigner: false
        },
      ]
      args: [
        {
          name: 'creatorKey'
          type: 'publicKey'
        },
        {
          name: 'uri'
          type: 'string'
        },
        {
          name: 'title'
          type: 'string'
        },
      ]
    },
    {
      name: 'transferToken'
      accounts: [
        {
          name: 'tokenProgram'
          isMut: false
          isSigner: false
        },
        {
          name: 'from'
          isMut: true
          isSigner: false
        },
        {
          name: 'to'
          isMut: true
          isSigner: false
        },
        {
          name: 'fromAuthority'
          isMut: false
          isSigner: true
        },
      ]
      args: []
    },
    {
      name: 'logReward'
      accounts: [
        {
          name: 'reward'
          isMut: true
          isSigner: true
        },
        {
          name: 'signer'
          isMut: true
          isSigner: true
        },
        {
          name: 'systemProgram'
          isMut: false
          isSigner: false
        },
      ]
      args: [
        {
          name: 'beLongTo'
          type: 'string'
        },
        {
          name: 'title'
          type: 'string'
        },
        {
          name: 'externalLink'
          type: 'string'
        },
        {
          name: 'winner'
          type: 'string'
        },
        {
          name: 'amount'
          type: 'u16'
        },
      ]
    },
  ]
  accounts: [
    {
      name: 'profile'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'username'
            type: 'string'
          },
          {
            name: 'twitter'
            type: 'string'
          },
          {
            name: 'telegram'
            type: 'string'
          },
          {
            name: 'discord'
            type: 'string'
          },
          {
            name: 'github'
            type: 'string'
          },
          {
            name: 'linkedin'
            type: 'string'
          },
          {
            name: 'walletAddress'
            type: 'string'
          },
        ]
      }
    },
    {
      name: 'reward'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'title'
            type: 'string'
          },
          {
            name: 'externalLink'
            type: 'string'
          },
          {
            name: 'winner'
            type: 'string'
          },
          {
            name: 'amount'
            type: 'u16'
          },
          {
            name: 'beLongTo'
            type: 'string'
          },
        ]
      }
    },
  ]
}

export const IDL: Flexin = {
  version: '0.1.0',
  name: 'flexin',
  constants: [
    {
      name: 'PROFILE_TAG',
      type: 'bytes',
      value: '[80, 82, 79, 70, 73, 76, 69]',
    },
    {
      name: 'EMPTY_STRING',
      type: 'string',
      value: '"EMPTY_STRING"',
    },
  ],
  instructions: [
    {
      name: 'createProfile',
      accounts: [
        {
          name: 'profile',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'signer',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'username',
          type: 'string',
        },
        {
          name: 'twitter',
          type: 'string',
        },
        {
          name: 'telegram',
          type: 'string',
        },
        {
          name: 'discord',
          type: 'string',
        },
        {
          name: 'github',
          type: 'string',
        },
        {
          name: 'linkedin',
          type: 'string',
        },
      ],
    },
    {
      name: 'updateProfile',
      accounts: [
        {
          name: 'profile',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'signer',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'username',
          type: 'string',
        },
        {
          name: 'twitter',
          type: 'string',
        },
        {
          name: 'telegram',
          type: 'string',
        },
        {
          name: 'linkedin',
          type: 'string',
        },
        {
          name: 'discord',
          type: 'string',
        },
        {
          name: 'github',
          type: 'string',
        },
      ],
    },
    {
      name: 'mintNft',
      accounts: [
        {
          name: 'mintAuthority',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'mint',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'metadata',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'tokenAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'tokenMetadataProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'payer',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'rent',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'masterEdition',
          isMut: true,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'creatorKey',
          type: 'publicKey',
        },
        {
          name: 'uri',
          type: 'string',
        },
        {
          name: 'title',
          type: 'string',
        },
      ],
    },
    {
      name: 'transferToken',
      accounts: [
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'from',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'to',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'fromAuthority',
          isMut: false,
          isSigner: true,
        },
      ],
      args: [],
    },
    {
      name: 'logReward',
      accounts: [
        {
          name: 'reward',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'signer',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'beLongTo',
          type: 'string',
        },
        {
          name: 'title',
          type: 'string',
        },
        {
          name: 'externalLink',
          type: 'string',
        },
        {
          name: 'winner',
          type: 'string',
        },
        {
          name: 'amount',
          type: 'u16',
        },
      ],
    },
  ],
  accounts: [
    {
      name: 'profile',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'username',
            type: 'string',
          },
          {
            name: 'twitter',
            type: 'string',
          },
          {
            name: 'telegram',
            type: 'string',
          },
          {
            name: 'discord',
            type: 'string',
          },
          {
            name: 'github',
            type: 'string',
          },
          {
            name: 'linkedin',
            type: 'string',
          },
          {
            name: 'walletAddress',
            type: 'string',
          },
        ],
      },
    },
    {
      name: 'reward',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'title',
            type: 'string',
          },
          {
            name: 'externalLink',
            type: 'string',
          },
          {
            name: 'winner',
            type: 'string',
          },
          {
            name: 'amount',
            type: 'u16',
          },
          {
            name: 'beLongTo',
            type: 'string',
          },
        ],
      },
    },
  ],
}
