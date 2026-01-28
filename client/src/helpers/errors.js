import Swal from 'sweetalert2'

export default function showError(error) {
    console.log(error);
    
    if (error.response) {
        Swal.fire({
            title: 'Error!',
            text: error.response.data.message,
            icon: 'error',
        })
    } else {
        Swal.fire({
            title: "Oops...",
            text: "Something went wrong!",
            icon: "error",
        })
    }
}