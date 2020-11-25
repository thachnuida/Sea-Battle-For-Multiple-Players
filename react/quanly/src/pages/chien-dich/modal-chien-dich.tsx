import React, { ChangeEvent, useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';

type OnModalCloseCallback = (item?: any) => any;

interface Props {
  item: any;
  show: boolean;
  onClose: OnModalCloseCallback;
}

const ModalChienDich: React.FC<Props> = (props) => {
  const defaultItem = {
    name: '',
    so_hang: 5,
    so_cot: 5,
    so_may_bay_moi_doi: 5,
    so_bom_moi_doi: 5,
    noi_dung_sau_khi_xong: '',
    is_open: 1,
    cho_phep_tan_cong: 0,
  };

  const [editItem, setEditItem] = useState<any>({...defaultItem});

  useEffect(() => {
    setEditItem({...defaultItem, ...props.item});
  }, [props.item])

  function handleSave() {
    props.onClose(editItem);
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
      const name = event.target.name;
      setEditItem({...editItem, [name]: event.target.value});
  }

  return (
    <Modal show={props.show} onHide={() => props.onClose()}>
      <Modal.Header closeButton>
        <Modal.Title>
          {editItem.id && 'Sửa chiến dịch'}
          {!editItem.id && 'Tạo chiến dịch'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form className="form">
          <div className="form-group">
            <label>Tên</label>
            <input className="form-control" name="name" value={editItem.name} onChange={handleInputChange} />
          </div>
          <div className="form-group row">
            <div className="col">
              <label>Số hàng</label>
              <input className="form-control" type="number" name="so_hang" value={editItem.so_hang} onChange={handleInputChange} />
            </div>
            <div className="col">
              <label>Số cột</label>
              <input className="form-control" type="number" name="so_cot" value={editItem.so_cot} onChange={handleInputChange} />
            </div>
          </div>
          <div className="form-group row">
            <div className="col">
              <label>Số máy bay</label>
              <input className="form-control" type="number" name="so_may_bay_moi_doi" value={editItem.so_may_bay_moi_doi} onChange={handleInputChange} />
            </div>
            <div className="col">
              <label>Số bom mỗi đội</label>
              <input className="form-control" type="number" name="so_bom_moi_doi" value={editItem.so_bom_moi_doi} onChange={handleInputChange} />
            </div>
          </div>
          <div className="form-group">
            <label>Trạng thái</label>
            <select className="form-control" name="is_open" value={editItem.is_open} onChange={handleInputChange}>
              <option value="0">Đóng chiến dịch</option>
              <option value="1">Mở chiến dịch</option>
            </select>
          </div>
          <div className="form-group">
            <label>Cho phép đặt bom</label>
            <select className="form-control" name="cho_phep_tan_cong" value={editItem.cho_phep_tan_cong} onChange={handleInputChange}>
              <option value="0">Chưa được đặt bom</option>
              <option value="1">Cho phép đặt bom</option>
            </select>
          </div>
          <div className="form-group">
            <label>Nội dung hiện ra sau khi bắn xong</label>
            <textarea className="form-control" name="noi_dung_sau_khi_xong" value={editItem.noi_dung_sau_khi_xong} onChange={handleInputChange} />
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <button className="btn btn-secondary" onClick={() => props.onClose()}>Đóng</button>
        <button className="btn btn-primary" onClick={() => handleSave()}>Lưu</button>
      </Modal.Footer>
    </Modal>
  )
}

export default ModalChienDich;