using AccountingSystem.Class.Global;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AccountingSystem.Models
{
    public class VoucherDTO
    {

        public Voucher voucher { get; set; }
        public List<VoucherDetail> voucherDetail { get; set; }
        public Response  response { get; set; }

    }
}