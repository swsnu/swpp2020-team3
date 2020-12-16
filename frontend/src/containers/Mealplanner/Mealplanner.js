import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux';

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';


import * as actionCreators from '../../store/actions/index'
import './Mealplanner.css'

/////

const updateIndex = (list) => {
    let newIndex = 1;
    let temp = list.flat()
    temp.map((element) => {
        element.id = newIndex
        newIndex++
    })
}
const chunk = (arr, size) =>
    Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
        arr.slice(i * size, i * size + size)
    );

// TODO: get articles and display thumbnail
export class Mealplanner extends Component {
    constructor(props) {
        super(props)
        this.onDragEnd = this.onDragEnd.bind(this);
    }
    state = {
        min: '',
        max: '',
        numOfDays: 0,
        // link to recipe of real_id = 0 will give us a 404 error or display that it's an empty recipe or should not be clickable
        recipeArray: [
            [{ id: 1, thumbnail: 0, real_id: 0 }, { id: 2, thumbnail: 0, real_id: 0}, { id: 3, thumbnail: 0, real_id: 0}],
            [{ id: 4, thumbnail: 0, real_id: 0 }, { id: 5, thumbnail: 0, real_id: 0 }, { id: 6, thumbnail: 0, real_id: 0 }],
            [{ id: 7, thumbnail: 0, real_id: 0 }, { id: 8, thumbnail: 0, real_id: 0 }, { id: 9, thumbnail: 0, real_id: 0 }]
        ],
        scrappedRecipes: [{ id: 1, thumbnail: 'hana' }, { id: 2, thumbnail: 'duna' },
        { id: 3, thumbnail: 'sena' }, { id: 4, thumbnail: 'nena' }],
        recipes: [],
        login_id: -1,
        pageStart: 0,
        pageNumber: 1,
    }

    clickPagePreviousHandler = () => {
        let newState={...this.state, pageStart: this.state.pageStart-5, pageNumber: this.state.pageStart-4};
        this.setState(newState)
    }

    clickPageNumberHandler = (id) => {
        let newState={...this.state, pageNumber: this.state.pageStart+id};
        this.setState(newState)
    }

    clickPageNextHandler = () => {
        let newState={...this.state, pageStart: this.state.pageStart+5, pageNumber: this.state.pageStart+6};
        this.setState(newState);
    }

    componentDidMount() {        
        // to connect with others' implementation
        // this.props.getMLRecipes().then((res) =>console.log('"retrieve list of ml articles')) //console.log('"retrieved recipes"'))
        // this.props.getScrappedRecipes().then((res) => console.log('"retrieved list of scrapped article"'));//this.setState({recipeArrays: list})
        
        // temporary function to get temp getrecipes
        this.props.isLogin().then(res => {
            this.setState({login_id: res.login_id})
            this.props.getMls(res.login_id).then((res)=> {
                let new_list = res.mlRecipes.map((recipe, index) => ({'id':index, 'thumbnail':recipe.thumbnail, 'real_id':recipe.id}))
                this.setState({recipes: new_list})
            })
            this.props.loadPlanner(res.login_id).then(res => {
                this.setState({recipeArray: res.planner.data})
            })
            this.props.onGetUser(res.login_id).then(res => {
                let new_list = res.getuser.recipe_basket.map((recipe, index) => ({'id':index, 'thumbnail':recipe.thumbnail, 'real_id':recipe.id}))
                this.setState({scrappedRecipes: new_list})
            })
        })
    }

    addDayAbove(index) {
        if (this.state.recipeArray.length >= 7) {
            console.log('max number is 7')
        }
        else {
            let insertSubList = [{ id: null, thumbnail: 0 }, { id: null, thumbnail: 0 }, { id: null, thumbnail: 0 }]
            let list = this.state.recipeArray;
            list.splice(index, 0, insertSubList)
            updateIndex(list)
            this.setState({ recipeArray: list })
        }
    }
    deleteDay(index){
        if(this.state.recipeArray.length == 1){
            console.log("can't make empty list")
        }
        else{
            let list = this.state.recipeArray;
            list.splice(index, 1)
            this.setState({recipeArray: list})
        }
    }
    generateSingleML(day){
        console.log(day)
        let currlist = this.state.recipes
        let arraylist = this.state.recipeArray
        if(currlist[0]){
            arraylist[day][0] = currlist[0];
        }
        else return;
        if(currlist[1]){
            arraylist[day][1] = currlist[1];
        }
        else return;
        if(currlist[2]){
            arraylist[day][2] = currlist[2];
        }
        else return;                            
    }
    generateAllML(){
        let currlist = this.state.recipes
        let arraylist = this.state.recipeArray
        let num = parseInt(this.state.numOfDays)
        let j = 0;
        for(let i=0; i<num; i++){
            if(currlist[j]){
                arraylist[i][0] = currlist[j];
                j=j+1
            }
            else break;
            if(currlist[j]){
                arraylist[i][1] = currlist[j];
                j=j+1
            }
            else break;
            if(currlist[j]){
                arraylist[i][2] = currlist[j];
                j=j+1
            }
            else break;                                  
        }
        this.setState({ recipeArray: arraylist })
    }

    onDragEnd(result) {
        const { source, destination } = result
        // no effect movements:
        if (!destination || destination.droppableId == 'scrappedArticles' 
            || (source.droppableId.split('day').length >= 2 && destination.droppableId=='scrappedArticles')
            //|| (source.droppableId.split('day').length >= 2 && destination.droppableId.split('day').length >= 2)
            || destination.index >= 3) {
            console.log('no movements')
            return;
        }
        if ((source.droppableId.split('day').length) >= 2 && (destination.droppableId.split('day').length) >= 2) {
            let s_day = source.droppableId
            let d_day = destination.droppableId
            if(s_day != d_day){ // from one day to another
                console.log('from one day to another day')
                return;
            }
            else{ // from and to the same day
                let day = source.droppableId.split('day')[1]
                let s_index = source.index +3*day
                let d_index = destination.index +3*day
                let recipeArray = this.state.recipeArray.flat();
                if(s_index-d_index==1 || s_index-d_index==-1){
                    console.log("swap")
                    let source = recipeArray[s_index].thumbnail
                    let dest = recipeArray[d_index].thumbnail
                    recipeArray[d_index]['thumbnail'] = source
                    recipeArray[s_index]['thumbnail'] = dest
                    let sid = recipeArray[s_index].real_id
                    let did = recipeArray[d_index].real_id
                    recipeArray[d_index]['real_id'] = sid
                    recipeArray[s_index]['real_id'] = did
                    let newList = (chunk(recipeArray, 3))
                    console.log(newList)
                    this.setState({recipeArray: newList})
                }
                else{
                    const [removed] = recipeArray.splice(s_index, 1);
                    recipeArray.splice(d_index, 0, removed);
                    updateIndex(recipeArray)
                    console.log(recipeArray)
                    let newList = (chunk(recipeArray, 3))
                    this.setState({recipeArray: newList})
                }
                return;
            }
        }
        else { // one list to another
            console.log(result);
            let recipeArray = this.state.recipeArray;
            let selected = this.state.scrappedRecipes[source.index]
            let d_id = destination.droppableId.split('day')[1]
            let m_id = destination.index
            let modify = recipeArray.splice(d_id, 1)
            let toswap = modify[0].splice(m_id, 1)
            toswap[0].thumbnail = selected.thumbnail
            toswap[0].real_id = selected.real_id
            // 여기에 추가로 다른 인자 넣을 수 있음
            selected = toswap[0]
            modify[0].splice(m_id, 0, selected)
            recipeArray.splice(d_id, 0, modify[0])
            console.log(recipeArray)
            this.setState({ recipeArray: recipeArray })
        }
    }

    historyPush(recipe){
        this.props.history.push(`/detail-page/${recipe.real_id}/`)
    }

    onClickSave(){
        this.props.savePlanner(this.state.login_id, this.state.recipeArray)
    }

    /* <Draggable direction="horizontal"> <-- 이 태그를 이용해서 horizontal flex에 맞게 drag and drop 가능.
        하지만 완벽하지 않음. 이 부분은 추후에 해결해야할것.
    */ 
   /*<label>하한</label>
                    <input id="min" type='number' value={this.state.min} onChange={(event) => this.setState({min: event.target.value})}/>
                    <label>상한</label>
                    <input id="max" type='number' value={this.state.max} onChange={(event) => this.setState({max: event.target.value})}/>
++                    */
    render() {

        let slicedPage = this.state.scrappedRecipes.slice(5*this.state.pageStart,5*this.state.pageStart+26);
        let slicedRecipes = this.state.scrappedRecipes.slice(5*(this.state.pageNumber-1),5*this.state.pageNumber);

        return (
            <div className = 'Mealplanner'>
                <div id='mpdsc'>
                    <h2>식단표</h2>
                    <div id='mlpDescription'>{'원하는만큼의 날짜를 선택하고 "추천 받기" 버튼을 누리시면'} </div>
                    <div id='mlpDescription2'>{'선택한 날짜 수만큼 추천 레시피로 채워집니다!'}</div>
                    <div className='Searchbar'>
                        <label id = 'targetdays'>날짜수</label>
                        <input id="numOfDays" type='number' min='0' max='7' placeholder='최대 7일' value={this.state.numOfDays}
                            onChange={(event) => this.setState({numOfDays: event.target.value})} />
                        <button id="ml-generate" onClick={() => this.generateAllML()}>추천 받기</button>
                    </div>
                    <button id='mlpSave' onClick={() => this.onClickSave()}>저장</button>
                </div>
                <div id='plannerContents'>
                    <DragDropContext onDragEnd={this.onDragEnd}>
                        <div className='column'>
                            {this.state.recipeArray && this.state.recipeArray.map((dayBlock, ind) => (
                                <div id='droppable' key={ind}>
                                    <Droppable droppableId={`day${ind}`} key={ind} direction='horizontal'> 
                                        {(provided) => (
                                            <div className='day' ref={provided.innerRef} {...provided.droppableProps} style={{display : "flex"}}>
                                                <button className = 'planbutton' id="addDayAbove" onClick={() => this.addDayAbove(ind)}>날짜 추가</button>
                                                <button className = 'planbutton' id="deleteDay" onClick={() => this.deleteDay(ind)}>날짜 삭제</button>
                                                <button className = 'planbutton' id = 'rightbutton' onClick={() => this.generateSingleML(ind)}>하루치 추천</button>
                                                <div id ='drag'>
                                                    {dayBlock && dayBlock.map((meal, index) => (
                                                        <Draggable draggableId={`day_${ind}/meal_${index}`} index={index} key={index} >
                                                            {(provided) => (
                                                                <div  ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} id="blabl" >
                                                                    <div className='singleBlock' >
                                                                        {meal.thumbnail == 0 
                                                                            ? <div className='emptyImage'/>
                                                                            :<img id='basketimage' onClick={() =>this.props.history.push(`/detail-page/${meal.real_id}`)} src={meal.thumbnail} width={100} height={100}/>}
                                                                    </div>
                                                                </div>
                                                            )} 
                                                        </Draggable>
                                                    ))}
                                                    {provided.placeholder}
                                                </div>
                                            </div>
                                        )}

                                    </Droppable>
                                </div>
                            ))}
                        </div>
                        <div id='recipeBasket'>
                            <h3>장바구니</h3>
                            <div id='drop'>
                                <Droppable droppableId="scrappedArticles">
                                    {(provided) => (
                                        <div id='basket' {...provided.droppableProps} ref={provided.innerRef}  direction='horizontal' style={{display : "flex"}}>
                                            {slicedRecipes && slicedRecipes.map((recipe, index) => (
                                                <Draggable key={recipe.id} draggableId={`recipe_${recipe.id}`} index={index}>
                                                    {(provided) => (
                                                        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                            <div className='scrappedRecipe'>
                                                                <img onClick={() =>this.props.history.push(`/detail-page/${recipe.real_id}`)} src={recipe.thumbnail} width='100' height='100'/>
                                                            </div>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </div>
                            <div className = "pages">
                                <div className = "page">
                                    {slicedPage.length >= 1 && <p>Page</p>}
                                </div>
                                <div className = "row">
                                    {this.state.pageStart != 0 && slicedPage.length >= 1 && <button className="list-page-previous-button"
                                            onClick={() => this.clickPagePreviousHandler()}>left</button>}
                                    {slicedPage.length >= 1 && <button className="list-page-number-button"
                                            style = {{backgroundColor: this.state.pageNumber%5==1 ? "grey" : null}}
                                            onClick={() => this.clickPageNumberHandler(1)}>{this.state.pageStart+1}</button>}
                                    {slicedPage.length >= 6 && <button className="list-page-number-button"
                                            style = {{backgroundColor: this.state.pageNumber%5==2 ? "grey" : null}}
                                            onClick={() => this.clickPageNumberHandler(2)}>{this.state.pageStart+2}</button>}
                                    {slicedPage.length >= 11 && <button className="list-page-number-button"
                                            style = {{backgroundColor: this.state.pageNumber%5==3 ? "grey" : null}}
                                            onClick={() => this.clickPageNumberHandler(3)}>{this.state.pageStart+3}</button>}
                                    {slicedPage.length >= 16 && <button className="list-page-number-button"
                                            style = {{backgroundColor: this.state.pageNumber%5==4 ? "grey" : null}}
                                            onClick={() => this.clickPageNumberHandler(4)}>{this.state.pageStart+4}</button>}
                                    {slicedPage.length >= 21 && <button className="list-page-number-button"
                                            style = {{backgroundColor: this.state.pageNumber%5==0 ? "grey" : null}}
                                            onClick={() => this.clickPageNumberHandler(5)}>{this.state.pageStart+5}</button>}
                                    {slicedPage.length >= 26 && <button className="list-page-next-button"
                                            disabled={false} onClick={() => this.clickPageNextHandler()}>right</button>}
                                </div>
                            </div>                                                        
                        </div>
                    </DragDropContext>
                </div>
            </div>
        )

    }
}

const mapStateToProps = state => {
    return {
        storedRecipes: state.rcp.randomRecipes,
        mlRecipes: state.rcp.mlRecipes,
        storedUser: state.user.getuser,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        // getMLRecipes: () =>
        //     dispatch(actionCreators.getMLRecipes()),
        // getScrappedRecipes: () => dispatch(actionCreators.getScrappedRecipes()),
        getRecipes: () => dispatch(actionCreators.getRandom()), // temp for getting sample recipes
        getMls: (id) => dispatch(actionCreators.getMl(id)),
        isLogin: () => dispatch(actionCreators.isLogin()),
        loadPlanner: (id) => dispatch(actionCreators.loadPlanner(id)),
        savePlanner: (id, planner) => dispatch(actionCreators.savePlanner(id, planner)),
        onGetUser: (id) =>
            dispatch(actionCreators.getUser(id)),
    }
}

Mealplanner.propTypes = {
    // onGetRandom: PropTypes.func,
    // storedRecipes: PropTypes.array,
    // history: PropTypes.object
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Mealplanner));
