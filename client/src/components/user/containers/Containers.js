import React, { Component } from 'react'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { deleteContainer } from '../../../actions/container-actions'

import Container from './Container'

function mapStateToProps(state) {
	return {
		user: state.user,
		containers: state.containers,
	}
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators({ deleteContainer }, dispatch)
}

class Containers extends Component {
	constructor(props) {
		super(props)

		this.state = {
			containers: [],
			category: "all"
		}

		this.deleteContainer = this.deleteContainer.bind(this)
	}

	filterByProperty(array, prop, value){
	    var filtered = [];
	
	    for(var i = 0; i < array.length; i++){
	        var obj = array[i];
	        for(var key in obj){
	            if(typeof(obj[key] == "object")){
	                var item = obj[key];
	                if(item[prop] === value){
	                    filtered.push(item);
	                }
	            }
	        }
	    }
	    console.log(value, filtered)
	    return filtered;
	}

	marginStyle = {
		padding: "50px 0"
	}

	deleteContainer(id) {
		this.props.deleteContainer(sessionStorage.token, id)	
	}

	render() {
		return (
			<div style={this.marginStyle}>
				{this.state.containers.map(container => {
					return (
						<Container 
							key={container.id}
							data={container}
							deleteContainer={this.deleteContainer}
						/>
					)
				})}
			</div>
		)
	}
}

export default connect(mapStateToProps)(Containers)

