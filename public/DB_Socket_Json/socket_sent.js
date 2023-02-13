 //Veri Gönderme
                        const jsonVeri = JSON.stringify({
                            isSocketToken: false,
                            toSocketToken: null,
                            isServerToken: false,
                            toServerToken: null,
                            isPrivateMessageUserId: false,
                            toPrivateMessageUserId: null,
                            data:response.dataItems,
                            dataType: "Order",
                            dataTypeTitle: "order_add",
                            dataTypeDescription: "Yeni Sipariş Geldi",
                            dataTypeDescription_EN: "New order has been arrived",
                            status: "success"
                        });
                        
                        socket.send(jsonVeri);
                        //Veri Gönderme Son