/*
4chan monitoring script

Listens for new threads and new replies to every thread.
*/
let fetch = require('node-fetch')
let Astoria = require('astoria')
let astoria = new Astoria({
    interval: 3, // 3 seconds
    updatesOnly: true // We're only interested in threads posted from now
})
fetch('https://a.4cdn.org/boards.json')
.then(r => r.json())
.then(json => {
    json.boards.forEach(b => {
        console.log('Following ', b.board)
        astoria.board(b.board)
            .listen(async (context, threads, err) => {
               if (err) { console.error(err); return ; }
               threads.forEach(thread => {
                    
                    console.log('Thread posted ', thread.no, ':', thread.com)

                    let unsubscribe = astoria.board('ck')
                        .thread(thread.no)
                        .listen((context, posts, err) => {
                            if (err) {
                                return console.log(err)
                                unsubscribe()
                            }

                                posts.forEach(post => console.log('Post:',thread.no, '#', post.no, ': ', post.com))
                                // Stop listening
                            
                        })
                })
            })
    })
})
