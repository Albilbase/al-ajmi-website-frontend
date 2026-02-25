import Swal from 'sweetalert2';

export const confirmDelete = async (title = 'هل أنت متأكد؟', text = 'لن تتمكن من التراجع عن هذا الحذف!') => {
  return Swal.fire({
    title,
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#DC143C',
    cancelButtonColor: '#64748b',
    confirmButtonText: 'نعم، احذف',
    cancelButtonText: 'إلغاء',
    reverseButtons: true
  });
};

export const confirmAction = async (title, text, confirmButtonText = 'نعم', icon = 'question') => {
  return Swal.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonColor: '#DC143C',
    cancelButtonColor: '#64748b',
    confirmButtonText,
    cancelButtonText: 'إلغاء',
    reverseButtons: true
  });
};


export const showAlert = (title, text, icon = 'success') => {
  return Swal.fire({
    title,
    text,
    icon,
    confirmButtonColor: '#DC143C',
  });
};

export default Swal;
