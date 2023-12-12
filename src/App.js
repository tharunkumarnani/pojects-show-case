import {Component} from 'react'
import Loader from 'react-loader-spinner'
import './App.css'

// This is the list (static data) used in the application. You can move it to any component if needed.

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const initializeApiStatus = {
  success: 'SUCCESS',
  loading: 'LOADING',
  initial: 'INITIAL',
  failure: 'FAILURE',
}

const ListItem = props => {
  const {projectDetails} = props
  const {name, imageUrl} = projectDetails
  return (
    <li className="list-item">
      <img src={imageUrl} className="project-img" alt={name} />
      <p className="name">{name}</p>
    </li>
  )
}

// Replace your code here
class App extends Component {
  state = {
    selectedCategory: categoriesList[0].id,
    projects: [],
    apiStatus: initializeApiStatus.initial,
  }

  componentDidMount() {
    this.getProjects()
  }

  getProjects = async () => {
    this.setState({apiStatus: initializeApiStatus.loading})
    const {selectedCategory} = this.state
    const url = `https://apis.ccbp.in/ps/projects?category=${selectedCategory}`
    const response = await fetch(url)

    if (response.ok) {
      const data = await response.json()
      const {projects} = data
      const updatedData = projects.map(each => ({
        id: each.id,
        name: each.name,
        imageUrl: each.image_url,
      }))
      this.setState({
        projects: updatedData,
        apiStatus: initializeApiStatus.success,
      })
    } else {
      this.setState({apiStatus: initializeApiStatus.failure})
    }
  }

  onChangeCategory = event => {
    this.setState({selectedCategory: event.target.value}, this.getProjects)
  }

  onSuccess = () => {
    const {projects} = this.state
    return (
      <ul className="list-items">
        {projects.map(each => (
          <ListItem key={each.id} projectDetails={each} />
        ))}
      </ul>
    )
  }

  onLoading = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" width={80} height={80} color="#328af2" />
    </div>
  )

  onFailure = () => (
    <>
      <img
        className="failure-img"
        alt="failure view"
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
      />
      <h1 className="fail-head">Oops! Something Went Wrong</h1>
      <p className="para">
        We cannot seem to find the page you are looking for.
      </p>
      <button className="retry" onClick={this.getProjects} type="button">
        Retry
      </button>
    </>
  )

  finalOutput = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case initializeApiStatus.loading:
        return this.onLoading()
      case initializeApiStatus.success:
        return this.onSuccess()
      case initializeApiStatus.failure:
        return this.onFailure()
      default:
        return null
    }
  }

  render() {
    const {selectedCategory} = this.state
    return (
      <div className="bg-cont">
        <nav className="nav-bar">
          <img
            className="nav-img"
            alt="website logo"
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
          />
        </nav>
        <div className="card">
          <select
            value={selectedCategory}
            onChange={this.onChangeCategory}
            className="select-style"
          >
            {categoriesList.map(each => (
              <option key={each.id} value={each.id}>
                {each.displayText}
              </option>
            ))}
          </select>
          <div className="api-cont">{this.finalOutput()}</div>
        </div>
      </div>
    )
  }
}

export default App
