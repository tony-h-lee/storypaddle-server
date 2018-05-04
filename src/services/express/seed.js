import User from '../../api/user/model';
import Narrative from '../../api/narratives/model';
import Scene from '../../api/scenes/model';
import Comments from '../../api/comments/model'

Scene.find({}).remove()
Comments.find({}).remove()

// Basic Populate, 2 Users, 1 Narrative and Create and Join

User.find({}).remove()
  .then(() => {
    User.create({
      email: 'test@test.com',
      password: 'aaaaaa',
    },{
      email: 'tonyhjlee@gmail.com',
      password: 'bbbbbb',
    },{
      role: 'admin',
      email: 'admin@storypaddle.com',
      password: 'admin1',
    })
      .then(() =>
        User.find({}).sort({ email: 'asc'}).then((users) => {
          Narrative.find({}).remove()
            .then(() => {
              Narrative.create({
                author: users[2]._id,
                title: 'The Last Marebender',
                synopsis: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur condimentum tempor vehicula. Aenean sit amet ultricies mauris, vel tincidunt lacus. Phasellus elit erat, faucibus nec dignissim ac, sodales quis nisl. Nulla iaculis varius nunc, at consequat nulla tempor et. Maecenas justo turpis, eleifend quis augue non, sollicitudin tincidunt elit. Phasellus cursus velit eu erat placerat iaculis. Aenean suscipit dolor nec velit consectetur, a sagittis sem mollis. Morbi hendrerit mi varius, tincidunt tortor eget, bibendum nunc. In non ex imperdiet, pharetra tellus in, interdum nisi. Pellentesque vitae turpis et ligula gravida porta. Nunc vel ultricies quam. Donec in magna aliquet, dignissim enim sit amet, placerat ipsum. Donec mattis, justo ut ornare faucibus, risus ex lacinia lectus, in dapibus magna odio id lectus. \n\n Quisque volutpat at nulla sed sollicitudin. Cras suscipit leo lacus, ac lobortis lacus hendrerit eu. Curabitur egestas leo ac enim maximus finibus. Fusce venenatis vitae nisl sit amet feugiat. Vestibulum quis tortor non enim tempus finibus sed eu arcu. Sed luctus dui sapien, vitae laoreet risus consectetur vitae. In vestibulum a diam non sollicitudin. Vivamus a ultricies lectus. Aliquam id viverra enim. Integer tristique, lectus et iaculis pretium, felis dolor ornare nisl, id rhoncus leo lorem sed nibh. Vivamus et justo volutpat, maximus lectus vel, elementum diam.',
                genre: 'Science Fiction',
                explicit: false,
                roles: [
                  {
                    name: 'Avon Barksdale',
                    gender: 'Male',
                    synopsis: 'Duis aliquam nunc ut nibh suscipit porttitor. Quisque maximus eros ac nisi aliquet vehicula. Suspendisse eget urna nisl. Phasellus ultricies diam quam, et mattis ligula porttitor vitae. Sed vehicula velit lorem, id volutpat lectus vulputate vel. Integer facilisis faucibus ligula ac ullamcorper. Integer dapibus, nisl eget imperdiet pulvinar, enim massa mattis mi, aliquam porttitor ex erat at purus. Praesent euismod purus nec sapien semper, quis pharetra ligula rhoncus. Morbi in sagittis nisi. Aliquam erat volutpat. Integer ullamcorper lectus nulla. Aenean mattis maximus massa nec gravida. \n\nSed dapibus libero id ullamcorper pharetra. Quisque sed cursus tortor. Suspendisse sit amet nisi id augue pulvinar tincidunt. Praesent metus arcu, placerat a lacus vel, molestie consectetur enim. Proin et augue vitae arcu mollis tincidunt. Pellentesque placerat lectus nunc, nec sagittis leo eleifend in. Maecenas felis nisi, blandit id fringilla sit amet, dictum nec ante.',
                    user: users[2]._id,
                  },
                  {
                    name: 'Ivory Parter',
                    gender: 'Non-binary',
                    user: users[1]._id,
                    synopsis: 'Sed dapibus libero id ullamcorper pharetra. Quisque sed cursus tortor. Suspendisse sit amet nisi id augue pulvinar tincidunt. Praesent metus arcu, placerat a lacus vel, molestie consectetur enim. Proin et augue vitae arcu mollis tincidunt. Pellentesque placerat lectus nunc, nec sagittis leo eleifend in. Maecenas felis nisi, blandit id fringilla sit amet, dictum nec ante. \n\nDonec lobortis venenatis elementum. Suspendisse potenti. In vestibulum rhoncus erat, quis aliquet est sollicitudin non. Donec rhoncus dolor ut mattis dignissim. Mauris eu facilisis ligula. Sed magna lorem, tincidunt at dui blandit, dictum placerat felis. Cras et posuere mi, vel euismod ipsum. Cras neque enim, consequat ac arcu sit amet, scelerisque sodales ante. Sed dui erat, fringilla non pellentesque non, faucibus vitae lectus. Pellentesque mauris felis, tincidunt sed faucibus sed, pharetra at dui. Sed pharetra tempor interdum. Praesent tempus pulvinar ipsum cursus faucibus.',
                  },
                  {
                    name: 'General Petra',
                    gender: 'Female',
                    synopsis: 'In non efficitur eros. Maecenas eget metus fermentum, feugiat est nec, eleifend tortor. Morbi iaculis, nulla nec fermentum pretium, augue arcu scelerisque nunc, sed tempus eros nisi vitae erat. Aenean leo velit, luctus fermentum velit sit amet, volutpat iaculis purus. Integer non egestas massa. Phasellus a lorem blandit, semper lacus sed, malesuada nisl. Praesent viverra ut lorem eu volutpat. Pellentesque cursus, felis sit amet ultrices molestie, lorem ante imperdiet dolor, in pretium leo mi vitae sapien. Praesent dictum turpis at felis aliquet, at lobortis purus auctor. Aenean vitae sollicitudin libero. Curabitur nec ligula ex. Nam ut vehicula risus. Curabitur viverra dolor orci, ac laoreet ex pulvinar a. In aliquet magna in condimentum hendrerit.'
                  }
                ]
              })
                .then((narrative) => {
                  Scene.create({
                    author: users[2]._id,
                    narrative: narrative._id
                  })
                    .then((scene) => {
                    Comments.create({
                      type: 'narration',
                      author: users[2]._id,
                      scene: scene._id,
                      text: 'Post 1: It was three in the morning. It was three in the morning. It was three in the morning. It was three in the morning. It was three in the morning. ',
                    })
                      Comments.create({
                        type: 'narration',
                        author: users[2]._id,
                        scene: scene._id,
                        text: 'Post 2: It was three in the morning. It was three in the morning. It was three in the morning. It was three in the morning. It was three in the morning. ',
                      })
                      Comments.create({
                        type: 'narration',
                        author: users[2]._id,
                        scene: scene._id,
                        text: 'Post 3: It was three in the morning. It was three in the morning. It was three in the morning. It was three in the morning. It was three in the morning. ',
                      })
                      Comments.create({
                        type: 'narration',
                        author: users[2]._id,
                        scene: scene._id,
                        text: 'Post 4: It was three in the morning. It was three in the morning. It was three in the morning. It was three in the morning. It was three in the morning. ',
                      })
                      Comments.create({
                        type: 'narration',
                        author: users[2]._id,
                        scene: scene._id,
                        text: 'Post 5: It was three in the morning. It was three in the morning. It was three in the morning. It was three in the morning. It was three in the morning. ',
                      })
                      Comments.create({
                        type: 'narration',
                        author: users[2]._id,
                        scene: scene._id,
                        text: 'Post 6: It was three in the morning. It was three in the morning. It was three in the morning. It was three in the morning. It was three in the morning. ',
                      })
                      Comments.create({
                        type: 'narration',
                        author: users[2]._id,
                        scene: scene._id,
                        text: 'Post 7: It was three in the morning. It was three in the morning. It was three in the morning. It was three in the morning. It was three in the morning. ',
                      })
                      Comments.create({
                        type: 'narration',
                        author: users[2]._id,
                        scene: scene._id,
                        text: 'Post 8: It was three in the morning. It was three in the morning. It was three in the morning. It was three in the morning. It was three in the morning. ',
                      })
                      Comments.create({
                        type: 'narration',
                        author: users[2]._id,
                        scene: scene._id,
                        text: 'Post 9: It was three in the morning. It was three in the morning. It was three in the morning. It was three in the morning. It was three in the morning. ',
                      })
                      Comments.create({
                        type: 'narration',
                        author: users[2]._id,
                        scene: scene._id,
                        text: 'Post 10: It was three in the morning. It was three in the morning. It was three in the morning. It was three in the morning. It was three in the morning. ',
                      })
                      Comments.create({
                        type: 'narration',
                        author: users[2]._id,
                        scene: scene._id,
                        text: 'Post 11: It was three in the morning. It was three in the morning. It was three in the morning. It was three in the morning. It was three in the morning. ',
                      })
                      Comments.create({
                        type: 'narration',
                        author: users[2]._id,
                        scene: scene._id,
                        text: 'Post 12: It was three in the morning. It was three in the morning. It was three in the morning. It was three in the morning. It was three in the morning. ',
                      })
                      Comments.create({
                        type: 'narration',
                        author: users[2]._id,
                        scene: scene._id,
                        text: 'Post 13: It was three in the morning. It was three in the morning. It was three in the morning. It was three in the morning. It was three in the morning. ',
                      })
                      Comments.create({
                        type: 'narration',
                        author: users[2]._id,
                        scene: scene._id,
                        text: 'Post 14: It was three in the morning. It was three in the morning. It was three in the morning. It was three in the morning. It was three in the morning. ',
                      })
                      Comments.create({
                        type: 'narration',
                        author: users[2]._id,
                        scene: scene._id,
                        text: 'Post 15: It was three in the morning. It was three in the morning. It was three in the morning. It was three in the morning. It was three in the morning. ',
                      })
                    return narrative.update({scene: scene._id})
                    })
                })
                .then(() => {
                  console.log('finished populating narratives');
                });
            })
        })
      )
      // ---------------- POPULATE NARRATIVES HERE -------------------
      .then(() => {
        // Populate Narratives

      })
      .then(
        console.log("FINISHED POPULATION")
      )
  });
