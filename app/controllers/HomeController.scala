package controllers

import de.htwg.se.toybrokersludo.aview.TUI
import de.htwg.se.toybrokersludo.controller.Controller
import de.htwg.se.toybrokersludo.model.FieldBaseImpl.Field
import de.htwg.se.toybrokersludo.model.FileIO.JsonImpl.FileIo
import play.api.libs.json.Json
import play.api.mvc._
import play.twirl.api.Html

import javax.inject._

@Singleton
class HomeController @Inject()(val controllerComponents: ControllerComponents) extends BaseController {

  private val field = Field()
  private val fileIO = FileIo()
  private val controller = new Controller(field, fileIO)
  new TUI(controller)

  def game() = Action { implicit request: Request[AnyContent] =>
    val text = controller.field.toString
    val htmlText = s"<pre>${text.replace("\n", "<br>")}</pre>"
    val html: Html = Html(htmlText)
    Ok(views.html.main(title = "Toy Brokers Ludo")(content = html))
  }

  def dice() = Action { implicit request: Request[AnyContent] =>
    controller.getShouldDice match {
      case true => {
        controller.doAndPublish(controller.dice)
        Ok(controller.getDice.toString)
      }
      case false => Conflict("Illegal state, player have to move")
    }
  }

  def getPossibleMoves() = Action { implicit request: Request[AnyContent] =>
    controller.getShouldDice match {
      case true => Conflict("Illegal state, player have to dice")
      case false => Ok(controller.getPossibleMoves(controller.getDice).toString())
    }
  }

  def move(index: Int) = Action { implicit request: Request[AnyContent] =>
    if (controller.getShouldDice) {
      Conflict("Illegal state, player have to dice")
    }
    controller.getPossibleMoves(controller.getDice).lift(index) match {
      case Some(move) =>
        controller.doAndPublish(controller.move, move)
        Ok(move.toString)
      case None => Conflict("Illegal move index")
    }
  }

  def undo() = Action { implicit request: Request[AnyContent] =>
    controller.doAndPublish(controller.undo)
    Ok("success")
  }

  def redo() = Action { implicit request: Request[AnyContent] =>
    controller.doAndPublish(controller.redo)
    Ok("success")
  }

  def save(path: String) = Action { implicit request: Request[AnyContent] =>
    controller.save(path)
    Ok("success")
  }

  def getSaveGames() = Action { implicit request: Request[AnyContent] =>
    Ok(Json.toJson(controller.getTargets()))
  }

  def load(path: String) = Action { implicit request: Request[AnyContent] =>
    controller.load(path)
    Ok("success")
  }
}
