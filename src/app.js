const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')




const app = express()
const port = process.env.PORT || 3000

//define paths for Express config

const publicDirectory = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')


//setup Handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

//setup static director to serve
app.use(express.static(publicDirectory))


app.get('', (req, res) => {
  res.render('index', {
    title: 'Weather app',
    name: 'Kevin'
  })
})

app.get('/about', (req, res) => {
  res.render('about', {
    title: 'About me',
    name: 'Kevin Shewey'
  })
})

app.get('/help', (req, res) => {
  res.render('help', {
    title: 'Help',
    message: 'Are you lost?  You\'ve come to the right place!',
    name: 'Kevin'
  })
})

app.get('/weather', (req, res) => {
if(!req.query.address) {
  return res.send({
    error: 'You must provide a location'
  })
}

geocode(req.query.address, (error, { latitude, longitude, location} = {}) => {
  if (error) {
    return res.send({ error })
  }

  forecast(latitude, longitude, (error, forecastData) => {
    if (error) {
      return res.send({ error })
    }
    res.send({
      forecast: forecastData,
      location,
      address: req.query.address
    })
  })
})








// res.send({
//     forecast: "It's hot for October",
//     location: "Right here",
//     address: req.query.address
//   })
})



app.get('/proudcts', (req, res) => {
  if(!req.query.search) {
    return res.send({
      error: 'You must provide a search term'
    })
  }
  console.log(req.query.search)
  res.send({
    products: []
  })
})



app.get('/help/*', (req, res) => {
    res.render('404', {
      title: '404 Missing article',
      message: "Sorry, the article you're looking for isn't here"
    })
})



app.get('*', (req, res) =>{
  res.render('404' , {
    title: '404 Missing page',
    message: "Sorry, cannot find the page"
  })
})



app.listen(port, () => {
  console.log('Server is up on port' + port)
})
