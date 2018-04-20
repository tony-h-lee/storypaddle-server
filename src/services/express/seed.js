import User from '../../api/user/model';
import Narrative from '../../api/narratives/model';


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
                author: users[1]._id,
                title: 'The Last Marebender',
                synopsis: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur condimentum tempor vehicula. Aenean sit amet ultricies mauris, vel tincidunt lacus. Phasellus elit erat, faucibus nec dignissim ac, sodales quis nisl. Nulla iaculis varius nunc, at consequat nulla tempor et. Maecenas justo turpis, eleifend quis augue non, sollicitudin tincidunt elit. Phasellus cursus velit eu erat placerat iaculis. Aenean suscipit dolor nec velit consectetur, a sagittis sem mollis. Morbi hendrerit mi varius, tincidunt tortor eget, bibendum nunc. In non ex imperdiet, pharetra tellus in, interdum nisi. Pellentesque vitae turpis et ligula gravida porta. Nunc vel ultricies quam. Donec in magna aliquet, dignissim enim sit amet, placerat ipsum. Donec mattis, justo ut ornare faucibus, risus ex lacinia lectus, in dapibus magna odio id lectus. \n\n Quisque volutpat at nulla sed sollicitudin. Cras suscipit leo lacus, ac lobortis lacus hendrerit eu. Curabitur egestas leo ac enim maximus finibus. Fusce venenatis vitae nisl sit amet feugiat. Vestibulum quis tortor non enim tempus finibus sed eu arcu. Sed luctus dui sapien, vitae laoreet risus consectetur vitae. In vestibulum a diam non sollicitudin. Vivamus a ultricies lectus. Aliquam id viverra enim. Integer tristique, lectus et iaculis pretium, felis dolor ornare nisl, id rhoncus leo lorem sed nibh. Vivamus et justo volutpat, maximus lectus vel, elementum diam.',
                genre: 'Science Fiction',
                explicit: false,
                roles: [
                  {
                    name: 'Avon Barksdale',
                    synopsis: 'Duis aliquam nunc ut nibh suscipit porttitor. Quisque maximus eros ac nisi aliquet vehicula. Suspendisse eget urna nisl. Phasellus ultricies diam quam, et mattis ligula porttitor vitae. Sed vehicula velit lorem, id volutpat lectus vulputate vel. Integer facilisis faucibus ligula ac ullamcorper. Integer dapibus, nisl eget imperdiet pulvinar, enim massa mattis mi, aliquam porttitor ex erat at purus. Praesent euismod purus nec sapien semper, quis pharetra ligula rhoncus. Morbi in sagittis nisi. Aliquam erat volutpat. Integer ullamcorper lectus nulla. Aenean mattis maximus massa nec gravida. \n\nSed dapibus libero id ullamcorper pharetra. Quisque sed cursus tortor. Suspendisse sit amet nisi id augue pulvinar tincidunt. Praesent metus arcu, placerat a lacus vel, molestie consectetur enim. Proin et augue vitae arcu mollis tincidunt. Pellentesque placerat lectus nunc, nec sagittis leo eleifend in. Maecenas felis nisi, blandit id fringilla sit amet, dictum nec ante.',
                    user: users[1]._id,
                  },
                  {
                    name: 'Ivory Parter',
                    synopsis: 'Sed dapibus libero id ullamcorper pharetra. Quisque sed cursus tortor. Suspendisse sit amet nisi id augue pulvinar tincidunt. Praesent metus arcu, placerat a lacus vel, molestie consectetur enim. Proin et augue vitae arcu mollis tincidunt. Pellentesque placerat lectus nunc, nec sagittis leo eleifend in. Maecenas felis nisi, blandit id fringilla sit amet, dictum nec ante. \n\nDonec lobortis venenatis elementum. Suspendisse potenti. In vestibulum rhoncus erat, quis aliquet est sollicitudin non. Donec rhoncus dolor ut mattis dignissim. Mauris eu facilisis ligula. Sed magna lorem, tincidunt at dui blandit, dictum placerat felis. Cras et posuere mi, vel euismod ipsum. Cras neque enim, consequat ac arcu sit amet, scelerisque sodales ante. Sed dui erat, fringilla non pellentesque non, faucibus vitae lectus. Pellentesque mauris felis, tincidunt sed faucibus sed, pharetra at dui. Sed pharetra tempor interdum. Praesent tempus pulvinar ipsum cursus faucibus.',
                    user: users[2]._id,
                  },
                  {
                    name: 'General Peters',
                    synopsis: 'In non efficitur eros. Maecenas eget metus fermentum, feugiat est nec, eleifend tortor. Morbi iaculis, nulla nec fermentum pretium, augue arcu scelerisque nunc, sed tempus eros nisi vitae erat. Aenean leo velit, luctus fermentum velit sit amet, volutpat iaculis purus. Integer non egestas massa. Phasellus a lorem blandit, semper lacus sed, malesuada nisl. Praesent viverra ut lorem eu volutpat. Pellentesque cursus, felis sit amet ultrices molestie, lorem ante imperdiet dolor, in pretium leo mi vitae sapien. Praesent dictum turpis at felis aliquet, at lobortis purus auctor. Aenean vitae sollicitudin libero. Curabitur nec ligula ex. Nam ut vehicula risus. Curabitur viverra dolor orci, ac laoreet ex pulvinar a. In aliquet magna in condimentum hendrerit.'
                  }
                ]
              })
                .then((narrative) => {
                  User.findOne({_id: users[1]._id})
                    .then((user) => {
                      user.ownedNarratives.push(narrative.id)
                      user.save()
                      return
                    })
                  User.findOne({_id: users[2]._id})
                    .then((user) => {
                      user.joinedNarratives.push(narrative.id)
                      user.save()
                      return
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
        User.find({}).sort({ email: 'asc'}).then((users) => {
          Narrative.create({
            author: users[1]._id,
            title: 'Lorem ipsum dolor',
            synopsis: 'Nunc nec turpis in est hendrerit feugiat. Suspendisse tempus maximus leo. Vivamus elit lectus, faucibus sed metus sit amet, vestibulum vestibulum lacus. Ut maximus tempus libero, non faucibus leo luctus ut. Nam ex tellus, finibus at nulla a, efficitur convallis dui. Quisque euismod velit ac laoreet rutrum. Proin efficitur, tortor eget dictum luctus, mi dui imperdiet erat, nec aliquet nisl nisl id dui. Fusce id dictum erat. Aliquam erat volutpat. Vestibulum a viverra nisi, sit amet scelerisque leo. Sed consequat dapibus porta. Ut aliquam libero nec risus semper cursus. Vivamus fermentum vel urna et fringilla.',
            genre: 'Fantasy',
            explicit: true,
            roles: [
              {
                name: 'Eva Green',
                synopsis: 'Vestibulum vitae magna et neque posuere tincidunt in a diam. Nulla molestie quam sit amet nisi molestie finibus. Integer a justo eu justo iaculis ultricies viverra sed ligula. Donec nec bibendum dolor.\n\nCurabitur nisl erat, molestie in purus vitae, suscipit volutpat neque. Mauris pellentesque enim neque, id fermentum augue pretium ut. Praesent feugiat et nunc non tempor. Suspendisse convallis, tortor laoreet ullamcorper congue, elit nibh semper sem, sit amet pharetra ex enim at massa. Fusce sed dolor lobortis, molestie diam in, efficitur metus. Vivamus congue ipsum eget enim fermentum laoreet. Vivamus condimentum luctus ultrices. Duis mauris libero, interdum a augue quis, placerat sodales massa. Suspendisse non lectus dignissim, vehicula nunc eget, aliquet erat.',
                user: users[1]._id,
              },
              {
                name: 'Mackenzie Zie',
                synopsis: 'Sed dapibus libero id ullamcorper pharetra. Quisque sed cursus tortor. Suspendisse sit amet nisi id augue pulvinar tincidunt. Praesent metus arcu, placerat a lacus vel, molestie consectetur enim. Proin et augue vitae arcu mollis tincidunt. Pellentesque placerat lectus nunc, nec sagittis leo eleifend in. Maecenas felis nisi, blandit id fringilla sit amet, dictum nec ante. \n\nDonec lobortis venenatis elementum. Suspendisse potenti. In vestibulum rhoncus erat, quis aliquet est sollicitudin non. Donec rhoncus dolor ut mattis dignissim. Mauris eu facilisis ligula. Sed magna lorem, tincidunt at dui blandit, dictum placerat felis. Cras et posuere mi, vel euismod ipsum. Cras neque enim, consequat ac arcu sit amet, scelerisque sodales ante. Sed dui erat, fringilla non pellentesque non, faucibus vitae lectus. Pellentesque mauris felis, tincidunt sed faucibus sed, pharetra at dui. Sed pharetra tempor interdum. Praesent tempus pulvinar ipsum cursus faucibus.',
              },
            ]
          })
          Narrative.create({
            author: users[1]._id,
            title: 'An Anime Fanfic',
            synopsis: 'Nunc nec turpis in est hendrerit feugiat. Suspendisse tempus maximus leo. Vivamus elit lectus, faucibus sed metus sit amet, vestibulum vestibulum lacus. Ut maximus tempus libero, non faucibus leo luctus ut. Nam ex tellus, finibus at nulla a, efficitur convallis dui. Quisque euismod velit ac laoreet rutrum. Proin efficitur, tortor eget dictum luctus, mi dui imperdiet erat, nec aliquet nisl nisl id dui. Fusce id dictum erat. Aliquam erat volutpat. Vestibulum a viverra nisi, sit amet scelerisque leo. Sed consequat dapibus porta. Ut aliquam libero nec risus semper cursus. Vivamus fermentum vel urna et fringilla.',
            genre: 'Fantasy',
            explicit: true,
            roles: [
              {
                name: 'Eva Green',
                synopsis: 'Vestibulum vitae magna et neque posuere tincidunt in a diam. Nulla molestie quam sit amet nisi molestie finibus. Integer a justo eu justo iaculis ultricies viverra sed ligula. Donec nec bibendum dolor.\n\nCurabitur nisl erat, molestie in purus vitae, suscipit volutpat neque. Mauris pellentesque enim neque, id fermentum augue pretium ut. Praesent feugiat et nunc non tempor. Suspendisse convallis, tortor laoreet ullamcorper congue, elit nibh semper sem, sit amet pharetra ex enim at massa. Fusce sed dolor lobortis, molestie diam in, efficitur metus. Vivamus congue ipsum eget enim fermentum laoreet. Vivamus condimentum luctus ultrices. Duis mauris libero, interdum a augue quis, placerat sodales massa. Suspendisse non lectus dignissim, vehicula nunc eget, aliquet erat.',
                user: users[1]._id,
              },
              {
                name: 'Mackenzie Zie',
                synopsis: 'Sed dapibus libero id ullamcorper pharetra. Quisque sed cursus tortor. Suspendisse sit amet nisi id augue pulvinar tincidunt. Praesent metus arcu, placerat a lacus vel, molestie consectetur enim. Proin et augue vitae arcu mollis tincidunt. Pellentesque placerat lectus nunc, nec sagittis leo eleifend in. Maecenas felis nisi, blandit id fringilla sit amet, dictum nec ante. \n\nDonec lobortis venenatis elementum. Suspendisse potenti. In vestibulum rhoncus erat, quis aliquet est sollicitudin non. Donec rhoncus dolor ut mattis dignissim. Mauris eu facilisis ligula. Sed magna lorem, tincidunt at dui blandit, dictum placerat felis. Cras et posuere mi, vel euismod ipsum. Cras neque enim, consequat ac arcu sit amet, scelerisque sodales ante. Sed dui erat, fringilla non pellentesque non, faucibus vitae lectus. Pellentesque mauris felis, tincidunt sed faucibus sed, pharetra at dui. Sed pharetra tempor interdum. Praesent tempus pulvinar ipsum cursus faucibus.',
              },
            ]
          })
          Narrative.create({
            author: users[1]._id,
            title: 'World War 2: Part II',
            synopsis: 'Nunc nec turpis in est hendrerit feugiat. Suspendisse tempus maximus leo. Vivamus elit lectus, faucibus sed metus sit amet, vestibulum vestibulum lacus. Ut maximus tempus libero, non faucibus leo luctus ut. Nam ex tellus, finibus at nulla a, efficitur convallis dui. Quisque euismod velit ac laoreet rutrum. Proin efficitur, tortor eget dictum luctus, mi dui imperdiet erat, nec aliquet nisl nisl id dui. Fusce id dictum erat. Aliquam erat volutpat. Vestibulum a viverra nisi, sit amet scelerisque leo. Sed consequat dapibus porta. Ut aliquam libero nec risus semper cursus. Vivamus fermentum vel urna et fringilla.',
            genre: 'Historical Fiction',
            explicit: false,
            roles: [
              {
                name: 'Eva Green',
                synopsis: 'Vestibulum vitae magna et neque posuere tincidunt in a diam. Nulla molestie quam sit amet nisi molestie finibus. Integer a justo eu justo iaculis ultricies viverra sed ligula. Donec nec bibendum dolor.\n\nCurabitur nisl erat, molestie in purus vitae, suscipit volutpat neque. Mauris pellentesque enim neque, id fermentum augue pretium ut. Praesent feugiat et nunc non tempor. Suspendisse convallis, tortor laoreet ullamcorper congue, elit nibh semper sem, sit amet pharetra ex enim at massa. Fusce sed dolor lobortis, molestie diam in, efficitur metus. Vivamus congue ipsum eget enim fermentum laoreet. Vivamus condimentum luctus ultrices. Duis mauris libero, interdum a augue quis, placerat sodales massa. Suspendisse non lectus dignissim, vehicula nunc eget, aliquet erat.',
                user: users[1]._id,
              },
              {
                name: 'Mackenzie Zie',
                synopsis: 'Sed dapibus libero id ullamcorper pharetra. Quisque sed cursus tortor. Suspendisse sit amet nisi id augue pulvinar tincidunt. Praesent metus arcu, placerat a lacus vel, molestie consectetur enim. Proin et augue vitae arcu mollis tincidunt. Pellentesque placerat lectus nunc, nec sagittis leo eleifend in. Maecenas felis nisi, blandit id fringilla sit amet, dictum nec ante. \n\nDonec lobortis venenatis elementum. Suspendisse potenti. In vestibulum rhoncus erat, quis aliquet est sollicitudin non. Donec rhoncus dolor ut mattis dignissim. Mauris eu facilisis ligula. Sed magna lorem, tincidunt at dui blandit, dictum placerat felis. Cras et posuere mi, vel euismod ipsum. Cras neque enim, consequat ac arcu sit amet, scelerisque sodales ante. Sed dui erat, fringilla non pellentesque non, faucibus vitae lectus. Pellentesque mauris felis, tincidunt sed faucibus sed, pharetra at dui. Sed pharetra tempor interdum. Praesent tempus pulvinar ipsum cursus faucibus.',
              },
            ]
          })
          Narrative.create({
            author: users[1]._id,
            title: 'The Legend of Zelda',
            synopsis: 'Nunc nec turpis in est hendrerit feugiat. Suspendisse tempus maximus leo. Vivamus elit lectus, faucibus sed metus sit amet, vestibulum vestibulum lacus. Ut maximus tempus libero, non faucibus leo luctus ut. Nam ex tellus, finibus at nulla a, efficitur convallis dui. Quisque euismod velit ac laoreet rutrum. Proin efficitur, tortor eget dictum luctus, mi dui imperdiet erat, nec aliquet nisl nisl id dui. Fusce id dictum erat. Aliquam erat volutpat. Vestibulum a viverra nisi, sit amet scelerisque leo. Sed consequat dapibus porta. Ut aliquam libero nec risus semper cursus. Vivamus fermentum vel urna et fringilla.',
            genre: 'Fantasy',
            explicit: false,
            roles: [
              {
                name: 'Eva Green',
                synopsis: 'Vestibulum vitae magna et neque posuere tincidunt in a diam. Nulla molestie quam sit amet nisi molestie finibus. Integer a justo eu justo iaculis ultricies viverra sed ligula. Donec nec bibendum dolor.\n\nCurabitur nisl erat, molestie in purus vitae, suscipit volutpat neque. Mauris pellentesque enim neque, id fermentum augue pretium ut. Praesent feugiat et nunc non tempor. Suspendisse convallis, tortor laoreet ullamcorper congue, elit nibh semper sem, sit amet pharetra ex enim at massa. Fusce sed dolor lobortis, molestie diam in, efficitur metus. Vivamus congue ipsum eget enim fermentum laoreet. Vivamus condimentum luctus ultrices. Duis mauris libero, interdum a augue quis, placerat sodales massa. Suspendisse non lectus dignissim, vehicula nunc eget, aliquet erat.',
                user: users[1]._id,
              },
              {
                name: 'Mackenzie Zie',
                synopsis: 'Sed dapibus libero id ullamcorper pharetra. Quisque sed cursus tortor. Suspendisse sit amet nisi id augue pulvinar tincidunt. Praesent metus arcu, placerat a lacus vel, molestie consectetur enim. Proin et augue vitae arcu mollis tincidunt. Pellentesque placerat lectus nunc, nec sagittis leo eleifend in. Maecenas felis nisi, blandit id fringilla sit amet, dictum nec ante. \n\nDonec lobortis venenatis elementum. Suspendisse potenti. In vestibulum rhoncus erat, quis aliquet est sollicitudin non. Donec rhoncus dolor ut mattis dignissim. Mauris eu facilisis ligula. Sed magna lorem, tincidunt at dui blandit, dictum placerat felis. Cras et posuere mi, vel euismod ipsum. Cras neque enim, consequat ac arcu sit amet, scelerisque sodales ante. Sed dui erat, fringilla non pellentesque non, faucibus vitae lectus. Pellentesque mauris felis, tincidunt sed faucibus sed, pharetra at dui. Sed pharetra tempor interdum. Praesent tempus pulvinar ipsum cursus faucibus.',
              },
            ]
          })
          Narrative.create({
            author: users[1]._id,
            title: 'Pirates of the Carribean',
            synopsis: 'Nunc nec turpis in est hendrerit feugiat. Suspendisse tempus maximus leo. Vivamus elit lectus, faucibus sed metus sit amet, vestibulum vestibulum lacus. Ut maximus tempus libero, non faucibus leo luctus ut. Nam ex tellus, finibus at nulla a, efficitur convallis dui. Quisque euismod velit ac laoreet rutrum. Proin efficitur, tortor eget dictum luctus, mi dui imperdiet erat, nec aliquet nisl nisl id dui. Fusce id dictum erat. Aliquam erat volutpat. Vestibulum a viverra nisi, sit amet scelerisque leo. Sed consequat dapibus porta. Ut aliquam libero nec risus semper cursus. Vivamus fermentum vel urna et fringilla.',
            genre: 'Fantasy',
            explicit: true,
            roles: [
              {
                name: 'Eva Green',
                synopsis: 'Vestibulum vitae magna et neque posuere tincidunt in a diam. Nulla molestie quam sit amet nisi molestie finibus. Integer a justo eu justo iaculis ultricies viverra sed ligula. Donec nec bibendum dolor.\n\nCurabitur nisl erat, molestie in purus vitae, suscipit volutpat neque. Mauris pellentesque enim neque, id fermentum augue pretium ut. Praesent feugiat et nunc non tempor. Suspendisse convallis, tortor laoreet ullamcorper congue, elit nibh semper sem, sit amet pharetra ex enim at massa. Fusce sed dolor lobortis, molestie diam in, efficitur metus. Vivamus congue ipsum eget enim fermentum laoreet. Vivamus condimentum luctus ultrices. Duis mauris libero, interdum a augue quis, placerat sodales massa. Suspendisse non lectus dignissim, vehicula nunc eget, aliquet erat.',
                user: users[1]._id,
              },
              {
                name: 'Mackenzie Zie',
                synopsis: 'Sed dapibus libero id ullamcorper pharetra. Quisque sed cursus tortor. Suspendisse sit amet nisi id augue pulvinar tincidunt. Praesent metus arcu, placerat a lacus vel, molestie consectetur enim. Proin et augue vitae arcu mollis tincidunt. Pellentesque placerat lectus nunc, nec sagittis leo eleifend in. Maecenas felis nisi, blandit id fringilla sit amet, dictum nec ante. \n\nDonec lobortis venenatis elementum. Suspendisse potenti. In vestibulum rhoncus erat, quis aliquet est sollicitudin non. Donec rhoncus dolor ut mattis dignissim. Mauris eu facilisis ligula. Sed magna lorem, tincidunt at dui blandit, dictum placerat felis. Cras et posuere mi, vel euismod ipsum. Cras neque enim, consequat ac arcu sit amet, scelerisque sodales ante. Sed dui erat, fringilla non pellentesque non, faucibus vitae lectus. Pellentesque mauris felis, tincidunt sed faucibus sed, pharetra at dui. Sed pharetra tempor interdum. Praesent tempus pulvinar ipsum cursus faucibus.',
              },
            ]
          })
          Narrative.create({
            author: users[1]._id,
            title: 'Harry Potter',
            synopsis: 'Nunc nec turpis in est hendrerit feugiat. Suspendisse tempus maximus leo. Vivamus elit lectus, faucibus sed metus sit amet, vestibulum vestibulum lacus. Ut maximus tempus libero, non faucibus leo luctus ut. Nam ex tellus, finibus at nulla a, efficitur convallis dui. Quisque euismod velit ac laoreet rutrum. Proin efficitur, tortor eget dictum luctus, mi dui imperdiet erat, nec aliquet nisl nisl id dui. Fusce id dictum erat. Aliquam erat volutpat. Vestibulum a viverra nisi, sit amet scelerisque leo. Sed consequat dapibus porta. Ut aliquam libero nec risus semper cursus. Vivamus fermentum vel urna et fringilla.',
            genre: 'Fantasy',
            explicit: false,
            roles: [
              {
                name: 'Eva Green',
                synopsis: 'Vestibulum vitae magna et neque posuere tincidunt in a diam. Nulla molestie quam sit amet nisi molestie finibus. Integer a justo eu justo iaculis ultricies viverra sed ligula. Donec nec bibendum dolor.\n\nCurabitur nisl erat, molestie in purus vitae, suscipit volutpat neque. Mauris pellentesque enim neque, id fermentum augue pretium ut. Praesent feugiat et nunc non tempor. Suspendisse convallis, tortor laoreet ullamcorper congue, elit nibh semper sem, sit amet pharetra ex enim at massa. Fusce sed dolor lobortis, molestie diam in, efficitur metus. Vivamus congue ipsum eget enim fermentum laoreet. Vivamus condimentum luctus ultrices. Duis mauris libero, interdum a augue quis, placerat sodales massa. Suspendisse non lectus dignissim, vehicula nunc eget, aliquet erat.',
                user: users[1]._id,
              },
              {
                name: 'Mackenzie Zie',
                synopsis: 'Sed dapibus libero id ullamcorper pharetra. Quisque sed cursus tortor. Suspendisse sit amet nisi id augue pulvinar tincidunt. Praesent metus arcu, placerat a lacus vel, molestie consectetur enim. Proin et augue vitae arcu mollis tincidunt. Pellentesque placerat lectus nunc, nec sagittis leo eleifend in. Maecenas felis nisi, blandit id fringilla sit amet, dictum nec ante. \n\nDonec lobortis venenatis elementum. Suspendisse potenti. In vestibulum rhoncus erat, quis aliquet est sollicitudin non. Donec rhoncus dolor ut mattis dignissim. Mauris eu facilisis ligula. Sed magna lorem, tincidunt at dui blandit, dictum placerat felis. Cras et posuere mi, vel euismod ipsum. Cras neque enim, consequat ac arcu sit amet, scelerisque sodales ante. Sed dui erat, fringilla non pellentesque non, faucibus vitae lectus. Pellentesque mauris felis, tincidunt sed faucibus sed, pharetra at dui. Sed pharetra tempor interdum. Praesent tempus pulvinar ipsum cursus faucibus.',
              },
            ]
          })
          Narrative.create({
            author: users[1]._id,
            title: 'Star Trek: The Finding',
            synopsis: 'Nunc nec turpis in est hendrerit feugiat. Suspendisse tempus maximus leo. Vivamus elit lectus, faucibus sed metus sit amet, vestibulum vestibulum lacus. Ut maximus tempus libero, non faucibus leo luctus ut. Nam ex tellus, finibus at nulla a, efficitur convallis dui. Quisque euismod velit ac laoreet rutrum. Proin efficitur, tortor eget dictum luctus, mi dui imperdiet erat, nec aliquet nisl nisl id dui. Fusce id dictum erat. Aliquam erat volutpat. Vestibulum a viverra nisi, sit amet scelerisque leo. Sed consequat dapibus porta. Ut aliquam libero nec risus semper cursus. Vivamus fermentum vel urna et fringilla.',
            genre: 'Science Fiction',
            explicit: false,
            roles: [
              {
                name: 'Eva Green',
                synopsis: 'Vestibulum vitae magna et neque posuere tincidunt in a diam. Nulla molestie quam sit amet nisi molestie finibus. Integer a justo eu justo iaculis ultricies viverra sed ligula. Donec nec bibendum dolor.\n\nCurabitur nisl erat, molestie in purus vitae, suscipit volutpat neque. Mauris pellentesque enim neque, id fermentum augue pretium ut. Praesent feugiat et nunc non tempor. Suspendisse convallis, tortor laoreet ullamcorper congue, elit nibh semper sem, sit amet pharetra ex enim at massa. Fusce sed dolor lobortis, molestie diam in, efficitur metus. Vivamus congue ipsum eget enim fermentum laoreet. Vivamus condimentum luctus ultrices. Duis mauris libero, interdum a augue quis, placerat sodales massa. Suspendisse non lectus dignissim, vehicula nunc eget, aliquet erat.',
                user: users[1]._id,
              },
              {
                name: 'Mackenzie Zie',
                synopsis: 'Sed dapibus libero id ullamcorper pharetra. Quisque sed cursus tortor. Suspendisse sit amet nisi id augue pulvinar tincidunt. Praesent metus arcu, placerat a lacus vel, molestie consectetur enim. Proin et augue vitae arcu mollis tincidunt. Pellentesque placerat lectus nunc, nec sagittis leo eleifend in. Maecenas felis nisi, blandit id fringilla sit amet, dictum nec ante. \n\nDonec lobortis venenatis elementum. Suspendisse potenti. In vestibulum rhoncus erat, quis aliquet est sollicitudin non. Donec rhoncus dolor ut mattis dignissim. Mauris eu facilisis ligula. Sed magna lorem, tincidunt at dui blandit, dictum placerat felis. Cras et posuere mi, vel euismod ipsum. Cras neque enim, consequat ac arcu sit amet, scelerisque sodales ante. Sed dui erat, fringilla non pellentesque non, faucibus vitae lectus. Pellentesque mauris felis, tincidunt sed faucibus sed, pharetra at dui. Sed pharetra tempor interdum. Praesent tempus pulvinar ipsum cursus faucibus.',
              },
            ]
          })
          Narrative.create({
            author: users[1]._id,
            title: 'One More For Good Luck',
            synopsis: 'Nunc nec turpis in est hendrerit feugiat. Suspendisse tempus maximus leo. Vivamus elit lectus, faucibus sed metus sit amet, vestibulum vestibulum lacus. Ut maximus tempus libero, non faucibus leo luctus ut. Nam ex tellus, finibus at nulla a, efficitur convallis dui. Quisque euismod velit ac laoreet rutrum. Proin efficitur, tortor eget dictum luctus, mi dui imperdiet erat, nec aliquet nisl nisl id dui. Fusce id dictum erat. Aliquam erat volutpat. Vestibulum a viverra nisi, sit amet scelerisque leo. Sed consequat dapibus porta. Ut aliquam libero nec risus semper cursus. Vivamus fermentum vel urna et fringilla.',
            genre: 'Historical Fiction',
            explicit: false,
            roles: [
              {
                name: 'Eva Green',
                synopsis: 'Vestibulum vitae magna et neque posuere tincidunt in a diam. Nulla molestie quam sit amet nisi molestie finibus. Integer a justo eu justo iaculis ultricies viverra sed ligula. Donec nec bibendum dolor.\n\nCurabitur nisl erat, molestie in purus vitae, suscipit volutpat neque. Mauris pellentesque enim neque, id fermentum augue pretium ut. Praesent feugiat et nunc non tempor. Suspendisse convallis, tortor laoreet ullamcorper congue, elit nibh semper sem, sit amet pharetra ex enim at massa. Fusce sed dolor lobortis, molestie diam in, efficitur metus. Vivamus congue ipsum eget enim fermentum laoreet. Vivamus condimentum luctus ultrices. Duis mauris libero, interdum a augue quis, placerat sodales massa. Suspendisse non lectus dignissim, vehicula nunc eget, aliquet erat.',
                user: users[1]._id,
              },
              {
                name: 'Mackenzie Zie',
                synopsis: 'Sed dapibus libero id ullamcorper pharetra. Quisque sed cursus tortor. Suspendisse sit amet nisi id augue pulvinar tincidunt. Praesent metus arcu, placerat a lacus vel, molestie consectetur enim. Proin et augue vitae arcu mollis tincidunt. Pellentesque placerat lectus nunc, nec sagittis leo eleifend in. Maecenas felis nisi, blandit id fringilla sit amet, dictum nec ante. \n\nDonec lobortis venenatis elementum. Suspendisse potenti. In vestibulum rhoncus erat, quis aliquet est sollicitudin non. Donec rhoncus dolor ut mattis dignissim. Mauris eu facilisis ligula. Sed magna lorem, tincidunt at dui blandit, dictum placerat felis. Cras et posuere mi, vel euismod ipsum. Cras neque enim, consequat ac arcu sit amet, scelerisque sodales ante. Sed dui erat, fringilla non pellentesque non, faucibus vitae lectus. Pellentesque mauris felis, tincidunt sed faucibus sed, pharetra at dui. Sed pharetra tempor interdum. Praesent tempus pulvinar ipsum cursus faucibus.',
              },
            ]
          })
          Narrative.create({
            author: users[1]._id,
            title: 'I Lied',
            synopsis: 'Nunc nec turpis in est hendrerit feugiat. Suspendisse tempus maximus leo. Vivamus elit lectus, faucibus sed metus sit amet, vestibulum vestibulum lacus. Ut maximus tempus libero, non faucibus leo luctus ut. Nam ex tellus, finibus at nulla a, efficitur convallis dui. Quisque euismod velit ac laoreet rutrum. Proin efficitur, tortor eget dictum luctus, mi dui imperdiet erat, nec aliquet nisl nisl id dui. Fusce id dictum erat. Aliquam erat volutpat. Vestibulum a viverra nisi, sit amet scelerisque leo. Sed consequat dapibus porta. Ut aliquam libero nec risus semper cursus. Vivamus fermentum vel urna et fringilla.',
            genre: 'Fantasy',
            explicit: true,
            roles: [
              {
                name: 'Eva Green',
                synopsis: 'Vestibulum vitae magna et neque posuere tincidunt in a diam. Nulla molestie quam sit amet nisi molestie finibus. Integer a justo eu justo iaculis ultricies viverra sed ligula. Donec nec bibendum dolor.\n\nCurabitur nisl erat, molestie in purus vitae, suscipit volutpat neque. Mauris pellentesque enim neque, id fermentum augue pretium ut. Praesent feugiat et nunc non tempor. Suspendisse convallis, tortor laoreet ullamcorper congue, elit nibh semper sem, sit amet pharetra ex enim at massa. Fusce sed dolor lobortis, molestie diam in, efficitur metus. Vivamus congue ipsum eget enim fermentum laoreet. Vivamus condimentum luctus ultrices. Duis mauris libero, interdum a augue quis, placerat sodales massa. Suspendisse non lectus dignissim, vehicula nunc eget, aliquet erat.',
                user: users[1]._id,
              },
              {
                name: 'Mackenzie Zie',
                synopsis: 'Sed dapibus libero id ullamcorper pharetra. Quisque sed cursus tortor. Suspendisse sit amet nisi id augue pulvinar tincidunt. Praesent metus arcu, placerat a lacus vel, molestie consectetur enim. Proin et augue vitae arcu mollis tincidunt. Pellentesque placerat lectus nunc, nec sagittis leo eleifend in. Maecenas felis nisi, blandit id fringilla sit amet, dictum nec ante. \n\nDonec lobortis venenatis elementum. Suspendisse potenti. In vestibulum rhoncus erat, quis aliquet est sollicitudin non. Donec rhoncus dolor ut mattis dignissim. Mauris eu facilisis ligula. Sed magna lorem, tincidunt at dui blandit, dictum placerat felis. Cras et posuere mi, vel euismod ipsum. Cras neque enim, consequat ac arcu sit amet, scelerisque sodales ante. Sed dui erat, fringilla non pellentesque non, faucibus vitae lectus. Pellentesque mauris felis, tincidunt sed faucibus sed, pharetra at dui. Sed pharetra tempor interdum. Praesent tempus pulvinar ipsum cursus faucibus.',
              },
            ]
          })
        })
          .then(
            console.log("FINISHED POPULATION")
          )
      });
  });
