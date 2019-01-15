import React, { Component } from 'react';
import axios from 'axios';
import { CustomInput } from 'reactstrap';

class ManageBrand extends Component {
    state= { brandList: [], AddBrandImage: 'Pilih Gambar', EditBrandImage: 'Pilih Gambar', selectedEditBrandId: 0 }
    componentDidMount() {
        // axios.get('http://localhost:1997/getlistbrand')
        axios.get('https://justifyester-heroku-hosting.herokuapp.com/getlistbrand')

        .then((res) => {
            console.log(res);
            this.setState({ brandList: res.data }) //res bisa diganti ganti karena res adalah nama variabel kalau data tidak bisa
        })
    }

    onBtnAddClick = () => {
        if(document.getElementById("AddBrandImage").files[0] !== undefined) {
            var formData = new FormData()
            var headers = {
                headers: 
                {'Content-Type': 'multipart/form-data'} //sudah baku 
            }

            var data = {
                nama: this.refs.AddBrandName.value, //dari isi nama brand nya
            }

            if(document.getElementById('AddBrandImage')){
                formData.append('image', document.getElementById('AddBrandImage').files[0]) //nerima string ddan filenya
            }
            formData.append('data', JSON.stringify(data)) //mengubah objek javascript jadi json

            axios.post("https://justifyester-heroku-hosting.herokuapp.com/addbrand", formData, headers)
            .then((res) => {
                alert("Add Brand Success")
                this.setState({ brandList: res.data })
            })
            .catch((err) =>{
                console.log(err)
            })
        }
        else {
            alert('Image harus diisi!')
        }
    }

    onBtnDeleteClick = (id) => {
        if(window.confirm('Are you sure to delete?')) {
            axios.delete('https://justifyester-heroku-hosting.herokuapp.com/deletebrand/' + id)
            .then((res) => {
                alert('Delete Success');
                this.setState({ brandList: res.data })
            })
            .catch((err) => {
                alert('Error')
                console.log(err);
            })
        }
    }

    onBtnUpdateClick = (id) => {
        var formData = new FormData()
        var headers = {
            headers: 
            {'Content-Type': 'multipart/form-data'}
        }

        var data = {
            nama: this.refs.EditBrandName.value,
        }

        if(document.getElementById('EditBrandImage')){
            formData.append('image', document.getElementById('EditBrandImage').files[0])
        }
        formData.append('data', JSON.stringify(data))

        axios.put("https://justifyester-heroku-hosting.herokuapp.com/editbrand/" + id, formData, headers)
        .then((res) => {
            alert("Edit Brand Success")
            this.setState({ brandList: res.data, selectedEditBrandId: 0 })
        })
        .catch((err) =>{
            console.log(err)
        })
    }

    onAddFileImageChange = () => {
        if(document.getElementById("AddBrandImage").files[0] !== undefined) {
            this.setState({AddBrandImage: document.getElementById("AddBrandImage").files[0].name})
        }
        else {
            this.setState({AddBrandImage: 'Pilih Gambar'})
        }
    }

    onEditFileImageChange = () => {
        if(document.getElementById("EditBrandImage").files[0] !== undefined) {
            this.setState({EditBrandImage: document.getElementById("EditBrandImage").files[0].name})
        }
        else {
            this.setState({EditBrandImage: 'Pilih Gambar'})
        }
    }

    renderBrandList = () => {
        var listJSX = this.state.brandList.map((item) => {
            if(item.id === this.state.selectedEditBrandId) { //saat edit 
                return (
                    <tr>
                        <td></td>
                        <td><input type="text" ref="EditBrandName" defaultValue={item.nama} /></td>
                        <td><CustomInput type="file" id="EditBrandImage" name="EditBrandImage" label={this.state.EditBrandImage} onChange={this.onEditFileImageChange} /></td>
                        <td><input type="button" class="btn btn-primary" value="Cancel" onClick={() => this.setState({ selectedEditBrandId: 0 })} /></td>
                        <td><input type="button" class="btn btn-primary" value="Save" onClick={() => this.onBtnUpdateClick(item.id)} /></td>
                    </tr>
                )
            }
            return ( //tidak edit --->>> jadi akan terus return kalau tidak sedang melakukan edit
                <tr>
                    <td>{item.id}</td>
                    <td>{item.nama}</td>
                    <td><img src={`https://justifyester-heroku-hosting.herokuapp.com/${item.image}`} alt={item.nama} width={100} /></td> 
                    <td><input type="button" class="btn btn-primary" value="Edit" onClick={() => this.setState({selectedEditBrandId:item.id})} /></td>
                    <td><input type="button" class="btn btn-danger" value="Delete" onClick={() => this.onBtnDeleteClick(item.id)} /></td>
                </tr>
            )
        })
        return listJSX;
    }

    render() {
        return (
            <div>
                <center>
                    <h1>Brand List</h1>
                    <table>
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Brand</th>
                                <th>Image</th>
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.renderBrandList()}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td></td>
                                <td><input type="text" ref="AddBrandName" /></td>
                                <td><CustomInput type="file" id="AddBrandImage" name="AddBrandImage" label={this.state.AddBrandImage} onChange={this.onAddFileImageChange} /></td>
                                <td></td>
                                <td><input type="button" class="btn btn-success" value="Add" onClick={this.onBtnAddClick} /></td>
                            </tr>
                        </tfoot>
                    </table>
                </center>
            </div>
        );
    }
}

export default ManageBrand;
